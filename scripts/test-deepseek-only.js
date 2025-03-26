// Set environment variables before any imports
process.env.VITE_WEATHER_API_KEY = 'mock-weather-key';
process.env.VITE_DEEPSEEK_API_KEY = 'sk-a29b8ba2513b479589fff068c31a84e3';

async function testDeepSeek() {
  try {
    // Dynamic import after env vars are set
    const api = await import('../src/services/api.js');
    const { getDeepSeekRecommendation } = api;
    
    // Create test weather data
    const testWeather = {
      dt: Date.now() / 1000,
      main: { temp: 18.5, humidity: 65 },
      wind: { speed: 2.5 },
      weather: [{ description: 'clear sky', main: 'Clear' }],
      visibility: 10000
    };

    console.log('Testing DeepSeek API...');
    const result = await getDeepSeekRecommendation(testWeather);
    
    console.log('API Response:', result);
    
    if (result.bestTime && result.duration && result.intensity && result.reasoning) {
      console.log('✅ Test passed');
      process.exit(0);
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testDeepSeek();