const BaseScraper = require('./BaseScraper');

class DolarHoyScraper extends BaseScraper {
  constructor() {
    super('https://www.dolarhoy.com', 'ARS');
  }

  async scrape() {
    try {
      const $ = await this.fetchPage();
      
      // Look for blue dollar prices
      const buyPrice = this.parsePrice($('.tile.is-child .cotizacion .compra .val').first().text());
      const sellPrice = this.parsePrice($('.tile.is-child .cotizacion .venta .val').first().text());
      
      if (!buyPrice || !sellPrice) {
        // Fallback selectors
        const altBuy = this.parsePrice($('.valor .compra').text());
        const altSell = this.parsePrice($('.valor .venta').text());
        
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
      console.error('DolarHoyScraper error:', error.message);
      return {
        buy_price: 0,
        sell_price: 0,
        source: this.url,
        error: error.message
      };
    }
  }
}

module.exports = DolarHoyScraper;