const AmbitoScraper = require('./AmbitoScraper');
const DolarHoyScraper = require('./DolarHoyScraper');
const CronistaScraper = require('./CronistaScraper');
const WiseScraper = require('./WiseScraper');
const NubankScraper = require('./NubankScraper');
const NomadScraper = require('./NomadScraper');

class ScraperManager {
  constructor() {
    this.scrapers = [
      new AmbitoScraper(),
      new DolarHoyScraper(),
      new CronistaScraper(),
      new WiseScraper(),
      new NubankScraper(),
      new NomadScraper()
    ];
    
    this.cache = {
      data: null,
      timestamp: null,
      ttl: 60 * 1000 // 60 seconds in milliseconds
    };
  }

  isDataFresh() {
    if (!this.cache.data || !this.cache.timestamp) {
      return false;
    }
    
    const now = Date.now();
    return (now - this.cache.timestamp) < this.cache.ttl;
  }

  async scrapeAll() {
    if (this.isDataFresh()) {
      console.log('Returning cached data');
      return this.cache.data;
    }

    console.log('Scraping fresh data from all sources...');
    
    try {
      // Run all scrapers in parallel for better performance
      const promises = this.scrapers.map(scraper => 
        scraper.scrape().catch(error => {
          console.error(`Scraper ${scraper.constructor.name} failed:`, error.message);
          return {
            buy_price: 0,
            sell_price: 0,
            source: scraper.url,
            error: error.message
          };
        })
      );

      const results = await Promise.all(promises);
      
      // Filter out results with errors and zero values for calculations
      const validResults = results.filter(result => 
        result.buy_price > 0 && result.sell_price > 0 && !result.error
      );

      // Update cache
      this.cache.data = {
        all: results,
        valid: validResults,
        timestamp: new Date().toISOString()
      };
      this.cache.timestamp = Date.now();

      return this.cache.data;
    } catch (error) {
      console.error('Error in scrapeAll:', error);
      throw error;
    }
  }

  async getQuotes() {
    const data = await this.scrapeAll();
    return data.all;
  }

  async getAverage() {
    const data = await this.scrapeAll();
    const validQuotes = data.valid;

    if (validQuotes.length === 0) {
      return {
        average_buy_price: 0,
        average_sell_price: 0,
        sources_count: 0,
        error: 'No valid quotes available'
      };
    }

    const totalBuy = validQuotes.reduce((sum, quote) => sum + quote.buy_price, 0);
    const totalSell = validQuotes.reduce((sum, quote) => sum + quote.sell_price, 0);

    return {
      average_buy_price: totalBuy / validQuotes.length,
      average_sell_price: totalSell / validQuotes.length,
      sources_count: validQuotes.length,
      timestamp: data.timestamp
    };
  }

  async getSlippage() {
    const data = await this.scrapeAll();
    const average = await this.getAverage();
    
    if (average.sources_count === 0) {
      return [];
    }

    return data.all.map(quote => {
      if (quote.error || quote.buy_price === 0 || quote.sell_price === 0) {
        return {
          buy_price_slippage: null,
          sell_price_slippage: null,
          source: quote.source,
          error: quote.error || 'Invalid price data'
        };
      }

      const buySlippage = (quote.buy_price - average.average_buy_price) / average.average_buy_price;
      const sellSlippage = (quote.sell_price - average.average_sell_price) / average.average_sell_price;

      return {
        buy_price_slippage: Math.round(buySlippage * 10000) / 10000, // 4 decimal places
        sell_price_slippage: Math.round(sellSlippage * 10000) / 10000,
        source: quote.source
      };
    });
  }
}

module.exports = ScraperManager;