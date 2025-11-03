const BaseScraper = require('./BaseScraper');

class AmbitoScraper extends BaseScraper {
  constructor() {
    super('https://www.ambito.com/contenidos/dolar.html', 'ARS');
  }

  async scrape() {
    try {
      const $ = await this.fetchPage();
      
      // Look for dollar blue prices (most common for USD/ARS)
      const buyPrice = this.parsePrice($('.variation-max-min .buy').first().text());
      const sellPrice = this.parsePrice($('.variation-max-min .sell').first().text());
      
      if (!buyPrice || !sellPrice) {
        // Fallback: try different selectors
        const altBuy = this.parsePrice($('.cotizacion-valor .compra').text());
        const altSell = this.parsePrice($('.cotizacion-valor .venta').text());
        
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
      console.error('AmbitoScraper error:', error.message);
      // Return fallback data to keep API working
      return {
        buy_price: 0,
        sell_price: 0,
        source: this.url,
        error: error.message
      };
    }
  }
}

module.exports = AmbitoScraper;