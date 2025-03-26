import axios from 'axios';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: resolve(__dirname, '../.env') });

// DeepSeek API key
const deepseekApiKey = process.env.VITE_DEEPSEEK_API_KEY;
if (!deepseekApiKey) {
  console.error('VITE_DEEPSEEK_API_KEY not found in environment variables');
  process.exit(1);
}

console.log('DeepSeek API Key:', deepseekApiKey.substring(0, 5) + '...');

// Test accessing the local proxy server
async function testProxyServer() {
  console.log('\n=== TESTING LOCAL PROXY SERVER ===');
  try {
    // Test GET request to check server health
    const healthResponse = await axios.get('http://localhost:3333/');
    console.log('Proxy server health check:', healthResponse.data);
    
    // Test endpoint availability
    const endpointResponse = await axios.get('http://localhost:3333/api/deepseek');
    console.log('Proxy endpoint check:', endpointResponse.data);
    
    // Test POST request with weather data
    const weatherData = {
      temperature: 15.5,
      humidity: 70,
      wind_speed: 2.5,
      conditions: 'clear',
      latitude: 47.1736,
      longitude: 8.5174,
      units: 'metric'
    };
    
    console.log('Sending test data to proxy server:', weatherData);
    const proxyResponse = await axios.post('http://localhost:3333/api/deepseek', 
      weatherData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Proxy server response:', proxyResponse.data);
    console.log('Status:', proxyResponse.status);
    return true;
  } catch (error) {
    console.error('Error testing proxy server:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Response data:', error.response.data);
    } else {
      console.error(error.message);
    }
    return false;
  }
}

// Test direct access to DeepSeek API (no proxy)
async function testDirectAPI() {
  console.log('\n=== TESTING DIRECT API ACCESS ===');
  try {
    const weatherData = {
      temperature: 15.5,
      humidity: 70,
      wind_speed: 2.5,
      conditions: 'clear',
      latitude: 47.1736,
      longitude: 8.5174,
      units: 'metric'
    };
    
    console.log('Sending test data directly to DeepSeek API:', weatherData);
    const apiResponse = await axios.post('https://api.deepseek.com/v1.2/recommendations', 
      weatherData,
      {
        headers: {
          'Authorization': `Bearer ${deepseekApiKey}`,
          'Content-Type': 'application/json',
          'Accept-Version': '1.2.0'
        },
        timeout: 15000
      }
    );
    
    console.log('Direct API response:', apiResponse.data);
    console.log('Status:', apiResponse.status);
    return true;
  } catch (error) {
    console.error('Error testing direct API access:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Response data:', error.response.data);
    } else {
      console.error(error.message);
    }
    return false;
  }
}

// Run both tests
async function runTests() {
  console.log('=== STARTING API TESTS ===');
  
  let proxySuccess = await testProxyServer();
  console.log('Proxy server test result:', proxySuccess ? 'SUCCESS' : 'FAILED');
  
  // Uncomment to test direct API access
  // let directSuccess = await testDirectAPI();
  // console.log('Direct API test result:', directSuccess ? 'SUCCESS' : 'FAILED');
  
  console.log('=== API TESTS COMPLETED ===');
}

// Run the tests
runTests().catch(error => {
  console.error('Unhandled error during tests:', error);
});