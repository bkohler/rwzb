import { getDeepSeekRecommendation, getWeatherForecast, getSunTimes, WeatherData } from './api';
import axios from 'axios';
import OpenAI from 'openai';

jest.mock('axios');
jest.mock('openai');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedOpenAI = OpenAI as jest.MockedClass<typeof OpenAI>;

describe('API Service', () => {
  beforeAll(() => {
    process.env.VITE_WEATHER_API_KEY = 'test_weather_key';
    process.env.VITE_DEEPSEEK_API_KEY = 'test_deepseek_key';
    
    mockedOpenAI.mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
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
          })
        }
      }
    }) as any);

    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes('sunrise-sunset')) {
        return Promise.resolve({
          data: {
            results: {
              sunrise: '2025-03-25T06:00:00+00:00',
              sunset: '2025-03-25T18:00:00+00:00'
            }
          }
        });
      }
      if (url.includes('openweathermap')) {
        return Promise.resolve({
          data: {
            list: [{
              dt: Date.now() / 1000,
              main: { temp: 18.5, humidity: 65 },
              wind: { speed: 2.5 },
              weather: [{ description: 'clear sky', main: 'Clear' }]
            }]
          }
        });
      }
      return Promise.reject(new Error('Unexpected API call'));
    });
  });

  test('getDeepSeekRecommendation returns valid structure', async () => {
    const testWeather: WeatherData = {
      dt: Date.now() / 1000,
      main: { temp: 18.5, humidity: 65 },
      wind: { speed: 2.5 },
      weather: [{ description: 'clear sky', main: 'Clear' }],
      visibility: 10000
    };

    const result = await getDeepSeekRecommendation(testWeather);
    expect(result).toMatchObject({
      bestTime: expect.any(String),
      duration: expect.any(String),
      intensity: expect.any(String),
      reasoning: expect.any(String)
    });
  });

  test('getWeatherForecast returns weather data', async () => {
    const result = await getWeatherForecast();
    expect(result).toHaveProperty('list');
    expect(Array.isArray(result.list)).toBe(true);
  });

  test('getSunTimes returns sunrise/sunset', async () => {
    const result = await getSunTimes();
    expect(result).toHaveProperty('results');
    expect(result.results).toHaveProperty('sunrise');
    expect(result.results).toHaveProperty('sunset');
  });
});