import { readFileSync } from 'fs';

// Load .env file manually since dotenv isn't working
const env = readFileSync('.env', 'utf8')
  .split('\n')
  .filter(line => line.trim() && !line.startsWith('#'))
  .reduce((acc, line) => {
    const [key, value] = line.split('=');
    acc[key] = value;
    return acc;
  }, {});

// Verify required environment variables
const requiredVars = ['VITE_DEEPSEEK_API_KEY', 'VITE_WEATHER_API_KEY'];
for (const varName of requiredVars) {
  if (!env[varName]) {
    console.error(`❌ Missing required environment variable: ${varName}`);
    process.exit(1);
  }
}

async function testDeepSeek() {
  try {
    process.env.VITE_DEEPSEEK_API_KEY = env.VITE_DEEPSEEK_API_KEY;
    process.env.VITE_WEATHER_API_KEY = env.VITE_WEATHER_API_KEY;

    const { getDeepSeekRecommendation } = await import('../src/services/api.js');
    
    const testWeather = {
      dt: Date.now() / 1000,
      main: { temp: 18.5, humidity: 65 },
      wind: { speed: 2.5 },
      weather: [{ description: 'clear sky', main: 'Clear' }],
      visibility: 10000
    };

    console.log('Testing DeepSeek API integration...');
    const result = await getDeepSeekRecommendation(testWeather);
    
    console.log('API Response:', result);
    
    if (result.bestTime && result.duration && result.intensity && result.reasoning) {
      console.log('✅ Test passed - received valid recommendation');
      process.exit(0);
    } else {
      console.error('❌ Test failed - invalid response format');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testDeepSeek();