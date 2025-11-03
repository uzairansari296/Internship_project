const axios = require('axios');
const cheerio = require('cheerio');

class BaseScraper {
  constructor(url, currency) {
    this.url = url;
    this.currency = currency;
    this.timeout = 10000; // 10 seconds timeout
  }

  async fetchPage() {
    try {
      const response = await axios.get(this.url, {
        timeout: this.timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      return cheerio.load(response.data);
    } catch (error) {
      console.error(`Error fetching ${this.url}:`, error.message);
      throw new Error(`Failed to fetch data from ${this.url}`);
    }
  }

  // Abstract method to be implemented by specific scrapers
  async scrape() {
    throw new Error('scrape() method must be implemented by subclass');
  }

  // Helper method to clean and parse price strings
  parsePrice(priceString) {
    if (!priceString) return null;
    
    // Remove currency symbols, commas, and extra whitespace
    const cleaned = priceString.replace(/[^\d.,]/g, '').replace(/,/g, '.');
    const price = parseFloat(cleaned);
    
    return isNaN(price) ? null : price;
  }
}

module.exports = BaseScraper;