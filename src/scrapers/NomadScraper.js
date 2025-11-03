const BaseScraper = require('./BaseScraper');

class NomadScraper extends BaseScraper {
  constructor() {
    super('https://www.nomadglobal.com', 'BRL');
  }

  async scrape() {
    try {
      const $ = await this.fetchPage();
      
      // Look for BRL exchange rates
      const rate = this.parsePrice($('.exchange-rate .rate').first().text());
      
      if (!rate) {
        // Alternative selectors
        const altRate = this.parsePrice($('.currency-converter .rate-display').text()) ||
                       this.parsePrice($('.conversion-rate').text());
        
        if (altRate) {
          const spread = 0.025; // 2.5% spread
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

      const spread = 0.025; // 2.5% spread estimation
      return {
        buy_price: rate * (1 - spread),
        sell_price: rate * (1 + spread),
        source: this.url
      };
    } catch (error) {
      console.error('NomadScraper error:', error.message);
      return {
        buy_price: 0,
        sell_price: 0,
        source: this.url,
        error: error.message
      };
    }
  }
}

module.exports = NomadScraper;