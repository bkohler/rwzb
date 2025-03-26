import { getDeepSeekRecommendation } from '../src/services/api.ts';
import axios from 'axios';
import { jest } from '@jest/globals';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

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

  // Mock successful API response
  mockedAxios.post.mockResolvedValueOnce({
    data: {
      choices: [{
        message: {
          content: JSON.stringify({
            bestTime: 'morning',
            duration: '45-60 minutes',
            intensity: 'moderate',
            reasoning: 'Test reasoning'
          })
        }
      }]
    }
  });

  try {
    const result = await getDeepSeekRecommendation(testWeather);
    console.log('✅ DeepSeek recommendation test passed');
    return result;
  } catch (error) {
    console.error('❌ DeepSeek recommendation test failed:', error);
    throw error;
  }
}

// Run test
testDeepSeekRecommendation();