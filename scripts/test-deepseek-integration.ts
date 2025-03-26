import { getDeepSeekRecommendation, WeatherData } from '../src/services/api.ts';

const testWeather: WeatherData = {
  dt: Date.now() / 1000,
  main: {
    temp: 18.5,
    humidity: 65
  },
  wind: {
    speed: 2.5
  },
  weather: [{
    description: 'clear sky',
    main: 'Clear'
  }],
  visibility: 10000
};

async function testDeepSeekIntegration() {
  console.log('=== TESTING DEEPSEEK API INTEGRATION ===');
  
  try {
    console.log('Calling getDeepSeekRecommendation with test weather data...');
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
    console.error('❌ Test failed with error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

testDeepSeekIntegration();