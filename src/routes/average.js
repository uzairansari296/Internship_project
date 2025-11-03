const express = require('express');
const ScraperManager = require('../scrapers/ScraperManager');

const router = express.Router();
const scraperManager = new ScraperManager();

// GET /average - Returns average buy and sell prices across all sources
router.get('/', async (req, res) => {
  try {
    const average = await scraperManager.getAverage();
    
    // Return object directly with only required fields as per assignment
    res.json({
      average_buy_price: Math.round(average.average_buy_price * 100) / 100, // 2 decimal places
      average_sell_price: Math.round(average.average_sell_price * 100) / 100
    });
  } catch (error) {
    console.error('Error in /average endpoint:', error);
    res.status(500).json({ error: 'Failed to calculate average' });
  }
});

module.exports = router;