import assert from 'assert';
import { getDeepSeekRecommendation } from '../dist/services/api.js';

// Mock environment variables
process.env.VITE_DEEPSEEK_API_KEY = 'test_key';
process.env.VITE_WEATHER_API_KEY = 'test_key';

// Simple test case
async function testDeepSeekRecommendation() {
  const testWeather = {
    dt: Date.now() / 1000,
    main: { temp: 18.5, humidity: 65 },
    wind: { speed: 2.5 },
    weather: [{ description: 'clear sky', main: 'Clear' }],
    visibility: 10000
  };

  try {
    const result = await getDeepSeekRecommendation(testWeather);
    assert.ok(result.bestTime, 'Should have bestTime');
    assert.ok(result.duration, 'Should have duration');
    assert.ok(result.intensity, 'Should have intensity');
    assert.ok(result.reasoning, 'Should have reasoning');
    console.log('✅ DeepSeek recommendation test passed');
  } catch (error) {
    console.error('❌ DeepSeek recommendation test failed:', error.message);
    process.exit(1);
  }
}

// Run tests
testDeepSeekRecommendation();