const BaseScraper = require('./BaseScraper');

class WiseScraper extends BaseScraper {
  constructor() {
    super('https://wise.com/es/currency-converter/brl-to-usd-rate', 'BRL');
  }

  async scrape() {
    try {
      const $ = await this.fetchPage();
      
      // Wise typically shows mid-market rate, we'll estimate buy/sell spread
      const rate = this.parsePrice($('.rate__rate').first().text());
      
      if (!rate) {
        // Alternative selectors
        const altRate = this.parsePrice($('.currency-input__converted-value').text());
        
        if (altRate) {
          const spread = 0.02; // 2% spread estimation
          return {
            buy_price: altRate * (1 - spread),
            sell_price: altRate * (1 + spread),
            source: this.url
          };
        }
        
        return {
          buy_price: 0,
          sell_price: 0,
          source: this.url
        };
      }

      // Apply estimated spread for buy/sell prices
      const spread = 0.02; // 2% spread
      return {
        buy_price: rate * (1 - spread),
        sell_price: rate * (1 + spread),
        source: this.url
      };
    } catch (error) {
      console.error('WiseScraper error:', error.message);
      return {
        buy_price: 0,
        sell_price: 0,
        source: this.url,
        error: error.message
      };
    }
  }
}

module.exports = WiseScraper;