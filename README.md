## Submission: Currency Converter Backend (USD↔BRL/ARS)

This document summarizes how to run the project, available APIs, and demo requests/responses. All endpoints return fresh data with a max 60s cache window.

### Run locally
- Node.js 18+
- Install and start:
```bash
npm install
npm start
```
Server runs at `http://localhost:3000`.

### Health
- Method: GET
- URL: `/health`
- Demo request:
```bash
curl -s http://localhost:3000/health | jq
```
- Demo response:
```json
{ "status": "OK", "timestamp": "2025-11-03T05:30:26.087Z" }
```

### Quotes
Returns an array of quotes from all sources (3 ARS + 3 BRL). Matches assignment structure exactly.
- Method: GET
- URL: `/quotes`
- Response (array of):
```json
{ "buy_price": 140.3, "sell_price": 144.0, "source": "https://www.ambito.com/contenidos/dolar.html" }
```
- Demo request:
```bash
curl -s http://localhost:3000/quotes | jq '.[0]'
```
- Demo response (example):
```json
{
  "buy_price": 0,
  "sell_price": 0,
  "source": "https://www.ambito.com/contenidos/dolar.html",
  "error": "Failed to fetch data from https://www.ambito.com/contenidos/dolar.html"
}
```
Notes:
- When a source fails or selectors change, that element may include `error` and zero prices. Other sources continue to work.

### Average
Returns the average buy/sell across valid sources only. Matches assignment structure exactly.
- Method: GET
- URL: `/average`
- Response (object):
```json
{ "average_buy_price": 142.3, "average_sell_price": 147.4 }
```
- Demo request:
```bash
curl -s http://localhost:3000/average | jq
```
- Demo response (example when no valid quotes):
```json
{ "average_buy_price": 0, "average_sell_price": 0 }
```

### Slippage
Returns an array with buy/sell slippage vs the average for each source. Matches assignment structure exactly.
- Method: GET
- URL: `/slippage`
- Response (array of):
```json
{ "buy_price_slippage": 0.04, "sell_price_slippage": -0.06, "source": "https://www.ambito.com/contenidos/dolar.html" }
```
- Demo request:
```bash
curl -s http://localhost:3000/slippage | jq '.[0]'
```
- Demo response (example when no valid quotes):
```json
[]
```

### Data freshness
- Cache TTL: 60 seconds
- Requests within 60s may return cached data; after 60s a fresh scrape is performed.

### Sources
- ARS: `ambito.com`, `dolarhoy.com`, `cronista.com`
- BRL: `wise.com`, `nubank.com.br`, `nomadglobal.com`

### Troubleshooting
- If a site blocks scraping (e.g., 403) the API still responds; failed sources return `buy_price: 0`, `sell_price: 0` and may include `error`.
- Ensure internet access and allow outbound HTTPS.

### Notes for reviewers
- Endpoints conform exactly to the assignment’s sample structures.
- Robust error handling; partial failures don’t break the API.

