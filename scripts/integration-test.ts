import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import { getDeepSeekRecommendation } from '../src/services/api.ts';

async function testDeepSeekIntegration() {
  if (!process.env.VITE_DEEPSEEK_API_KEY) {
    console.error('❌ VITE_DEEPSEEK_API_KEY environment variable is required');
    process.exit(1);
  }

  const testWeather = {
    dt: Date.now() / 1000,
    main: { temp: 18.5, humidity: 65 },
    wind: { speed: 2.5 },
    weather: [{ description: 'clear sky', main: 'Clear' }],
    visibility: 10000
  };

  try {
    console.log('Testing DeepSeek API integration...');
    const result = await getDeepSeekRecommendation(testWeather);
    
    console.log('API Response:', result);
    
    if (result?.bestTime && result?.duration && result?.intensity && result?.reasoning) {
      console.log('✅ DeepSeek API integration test passed');
      process.exit(0);
    } else {
      throw new Error('Invalid response structure');
    }
  } catch (error) {
    console.error('❌ DeepSeek API integration test failed:', error);
    process.exit(1);
  }
}

testDeepSeekIntegration();