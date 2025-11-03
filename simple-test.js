const express = require('express');

const app = express();
const PORT = 3000;

app.get('/test', (req, res) => {
  res.json({ message: 'Simple test server working', timestamp: new Date() });
});

app.listen(PORT, (err) => {
  if (err) {
    console.error('Failed to start server:', err);
  } else {
    console.log(`Simple test server running on port ${PORT}`);
    
    // Test the server immediately
    const http = require('http');
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: '/test',
      method: 'GET'
    };

    setTimeout(() => {
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          console.log('Self-test response:', data);
          process.exit(0);
        });
      });

      req.on('error', (e) => {
        console.error('Self-test error:', e.message);
        process.exit(1);
      });

      req.end();
    }, 1000);
  }
});