import axios from 'axios';

const SUN_API_URL = 'https://api.sunrise-sunset.org/json';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

// Define interface for the response from the Sunrise-Sunset API
interface SunTimesResponse {
  results: {
    sunrise: string;
    sunset: string;
  };
}

export interface WeatherData {
  dt: number;
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  weather: {
    description: string;
    main: string;
  }[];
  visibility: number;
  rain?: {
    '1h': number;
  };
}

export class APIError extends Error {
  readonly isOperational: boolean;
  
  constructor(message: string, isOperational: boolean) {
    super(message);
    this.isOperational = isOperational;
  }
}

interface WeatherResponse {
  list: WeatherData[];
}

// Zugerberg coordinates
export const LAT = 47.1736;
export const LNG = 8.5174;

/**
 * Fetches sunrise and sunset times for Zugerberg
 */
export async function getSunTimes(forTomorrow: boolean = false): Promise<SunTimesResponse> {
  // Calculate tomorrow's date if needed
  let date = new Date();
  if (forTomorrow) {
    date = new Date(date.getTime() + 24 * 60 * 60 * 1000);
  }
  
  // Format date as YYYY-MM-DD
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  
  const response = await axios.get(SUN_API_URL, {
    params: {
      lat: LAT,
      lng: LNG,
      formatted: 0, // Get time in ISO 8601 format
      date: formattedDate
    }
  });
  return response.data;
}

/**
 * Fetches weather forecast for Zugerberg
 */
export async function getWeatherForecast(forTomorrow: boolean = false): Promise<WeatherResponse> {
  if (!WEATHER_API_KEY) {
    throw new Error('Weather API key is not configured');
  }

  const response = await axios.get(WEATHER_API_URL, {
    params: {
      lat: LAT,
      lon: LNG,
      appid: WEATHER_API_KEY,
      units: 'metric',
      cnt: forTomorrow ? 16 : 8 // Get 16 entries for tomorrow (48 hours)
    }
  });
  return response.data;
}

/**
 * Evaluates if weather conditions are suitable for running
 */
export function isGoodWeather(weather: WeatherData): boolean {
  // Bad conditions: heavy rain, strong wind, poor visibility, extreme temperatures
  if (weather.rain && weather.rain['1h'] > 1) return false; // More than 1mm rain per hour
  if (weather.wind.speed > 8) return false; // Wind speed over 8 m/s (~30 km/h)
  if (weather.visibility < 5000) return false; // Visibility less than 5km
  if (weather.main.temp < 5 || weather.main.temp > 30) return false; // Temperature outside 5-30°C range
  
  // Check for bad weather conditions in description
  const badConditions = ['thunderstorm', 'shower', 'snow', 'sleet', 'drizzle'];
  if (badConditions.some(condition => 
    weather.weather[0].description.toLowerCase().includes(condition))) {
    return false;
  }
  
  return true;
}

/**
 * Get a summary of the weather conditions
 */
export function getWeatherSummary(weather: WeatherData): string {
  return `${Math.round(weather.main.temp)}°C, ${weather.weather[0].description}`;
}

export interface DeepSeekRecommendation {
  bestTime: string;
  duration: string;
  intensity: string;
  reasoning: string;
}

const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const systemPrompt = `You are an expert running coach combining David Roche's playful mindset and Jason Koop's evidence-based approach. Based on weather conditions, suggest optimal running parameters including:
- Best time window (morning/afternoon/evening)
- Recommended duration (30-120 mins)
- Training intensity (easy/moderate/hard)
- Detailed reasoning considering temperature, humidity, wind and conditions

Return response as JSON with these properties:
- bestTime: string
- duration: string
- intensity: string
- reasoning: string`;
/**
 * Get recommendations for running based on weather conditions from DeepSeek API
 */
export async function getDeepSeekRecommendation(
  weather: WeatherData
): Promise<DeepSeekRecommendation> {
  try {
    if (!DEEPSEEK_API_KEY) {
      throw new Error('DeepSeek API key is not configured');
    }

    const prompt = `Current weather:
    - Temperature: ${weather.main.temp}°C
    - Humidity: ${weather.main.humidity}%
    - Wind: ${weather.wind.speed} m/s
    - Conditions: ${weather.weather[0].description}`;

    console.log('Using system prompt:', systemPrompt);
    const response = await axios.post(
      'https://api.deepseek.com/chat/completions',
      {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        }
      }
    );

    const content = response.data.choices[0].message.content;
    if (!content) {
      throw new Error('Empty response received from DeepSeek API');
    }

    try {
      const result = JSON.parse(content);
      
      // Validate response structure
      if (!result.bestTime || !result.duration || !result.intensity || !result.reasoning) {
        throw new Error('Invalid response format from DeepSeek API');
      }

      return result;
    } catch (err) {
      throw new Error(`Failed to parse DeepSeek API response: ${err instanceof Error ? err.message : String(err)}`);
    }
  } catch (error) {
    console.error('DeepSeek API Error:', error);
    throw new APIError(
      'Failed to get DeepSeek recommendation',
      true
    );
  }
}
