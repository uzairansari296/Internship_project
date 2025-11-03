const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testEndpoints() {
  try {
    console.log('Testing Currency Converter API...\n');

    // Test health endpoint
    console.log('1. Testing /health endpoint:');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('Status:', healthResponse.status);
    console.log('Response:', JSON.stringify(healthResponse.data, null, 2));
    console.log('\n');

    // Test quotes endpoint
    console.log('2. Testing /quotes endpoint:');
    const quotesResponse = await axios.get(`${BASE_URL}/quotes`);
    console.log('Status:', quotesResponse.status);
    console.log('Response sample:', JSON.stringify(quotesResponse.data, null, 2));
    console.log('\n');

    // Test average endpoint
    console.log('3. Testing /average endpoint:');
    const averageResponse = await axios.get(`${BASE_URL}/average`);
    console.log('Status:', averageResponse.status);
    console.log('Response:', JSON.stringify(averageResponse.data, null, 2));
    console.log('\n');

    // Test slippage endpoint
    console.log('4. Testing /slippage endpoint:');
    const slippageResponse = await axios.get(`${BASE_URL}/slippage`);
    console.log('Status:', slippageResponse.status);
    console.log('Response sample:', JSON.stringify(slippageResponse.data, null, 2));
    console.log('\n');

    console.log('All tests completed successfully! 🎉');
  } catch (error) {
    console.error('Test failed:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', error);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', error.response.data);
    }
  }
}

testEndpoints();