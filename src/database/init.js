const db = require('./db');

const initializeDatabase = async () => {
  try {
    await db.connect();
    
    // Create quotes table to cache currency data
    await db.run(`
      CREATE TABLE IF NOT EXISTS quotes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source TEXT NOT NULL,
        currency TEXT NOT NULL,
        buy_price REAL NOT NULL,
        sell_price REAL NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create index for faster queries
    await db.run(`
      CREATE INDEX IF NOT EXISTS idx_quotes_currency_updated 
      ON quotes(currency, updated_at)
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

module.exports = { initializeDatabase };