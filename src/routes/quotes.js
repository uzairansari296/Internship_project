const express = require('express');
const ScraperManager = require('../scrapers/ScraperManager');

const router = express.Router();
const scraperManager = new ScraperManager();

// GET /quotes - Returns array of currency quotes from all sources
router.get('/', async (req, res) => {
  try {
    const quotes = await scraperManager.getQuotes();
    
    // Return array directly as per assignment requirements
    res.json(quotes);
  } catch (error) {
    console.error('Error in /quotes endpoint:', error);
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

module.exports = router;