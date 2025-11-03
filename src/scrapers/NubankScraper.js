const BaseScraper = require('./BaseScraper');

class NubankScraper extends BaseScraper {
  constructor() {
    super('https://nubank.com.br/taxas-conversao/', 'BRL');
  }

  async scrape() {
    try {
      const $ = await this.fetchPage();
      
      // Look for USD/BRL conversion rates
      const rate = this.parsePrice($('.conversion-rate .rate-value').first().text());
      
      if (!rate) {
        // Alternative selectors for Nubank's rate display
        const altRate = this.parsePrice($('.exchange-rate .value').text()) || 
                       this.parsePrice($('.currency-rate').text());
        
        if (altRate) {
          const spread = 0.015; // 1.5% spread
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

      const spread = 0.015; // 1.5% spread estimation
      return {
        buy_price: rate * (1 - spread),
        sell_price: rate * (1 + spread),
        source: this.url
      };
    } catch (error) {
      console.error('NubankScraper error:', error.message);
      return {
        buy_price: 0,
        sell_price: 0,
        source: this.url,
        error: error.message
      };
    }
  }
}

module.exports = NubankScraper;