const BaseScraper = require('./BaseScraper');

class CronistaScraper extends BaseScraper {
  constructor() {
    super('https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB', 'ARS');
  }

  async scrape() {
    try {
      const $ = await this.fetchPage();
      
      // Look for currency values
      const buyPrice = this.parsePrice($('.buy-value').first().text());
      const sellPrice = this.parsePrice($('.sell-value').first().text());
      
      if (!buyPrice || !sellPrice) {
        // Alternative selectors
        const altBuy = this.parsePrice($('.compra .value').text());
        const altSell = this.parsePrice($('.venta .value').text());
        
        return {
          buy_price: buyPrice || altBuy || 0,
          sell_price: sellPrice || altSell || 0,
          source: this.url
        };
      }

      return {
        buy_price: buyPrice,
        sell_price: sellPrice,
        source: this.url
      };
    } catch (error) {
      console.error('CronistaScraper error:', error.message);
      return {
        buy_price: 0,
        sell_price: 0,
        source: this.url,
        error: error.message
      };
    }
  }
}

module.exports = CronistaScraper;