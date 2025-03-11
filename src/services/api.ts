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

interface WeatherData {
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

interface WeatherResponse {
  list: WeatherData[];
}

// Zugerberg coordinates
const LAT = 47.1736;
const LNG = 8.5174;

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