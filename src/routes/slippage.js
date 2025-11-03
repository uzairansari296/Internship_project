const express = require('express');
const ScraperManager = require('../scrapers/ScraperManager');

const router = express.Router();
const scraperManager = new ScraperManager();

// GET /slippage - Returns slippage percentage for each source compared to average
router.get('/', async (req, res) => {
  try {
    const slippage = await scraperManager.getSlippage();
    
    // Return array directly as per assignment requirements
    res.json(slippage);
  } catch (error) {
    console.error('Error in /slippage endpoint:', error);
    res.status(500).json({ error: 'Failed to calculate slippage' });
  }
});

module.exports = router;