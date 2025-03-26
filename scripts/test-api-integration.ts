import { getDeepSeekRecommendation } from './api';
import { WeatherData } from './api';

describe('getDeepSeekRecommendation', () => {
  it('should return valid recommendation from real API', async () => {
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

    const result = await getDeepSeekRecommendation(testWeather);
    
    expect(result).toHaveProperty('bestTime');
    expect(result).toHaveProperty('duration'); 
    expect(result).toHaveProperty('intensity');
    expect(result).toHaveProperty('reasoning');
    expect(typeof result.bestTime).toBe('string');
    expect(typeof result.duration).toBe('string');
    expect(typeof result.intensity).toBe('string');
    expect(typeof result.reasoning).toBe('string');
  });
});