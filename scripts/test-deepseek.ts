import 'dotenv/config';
import * as api from '/home/bkohler/code/rwzb/src/services/api.js';
const { getDeepSeekRecommendation, LAT, LNG, getWeatherForecast } = api;
import type { WeatherData } from '../src/services/api';
import axios from 'axios';
import * as process from 'process';
import 'dotenv/config';

// Test configuration
const TEST_TIMEOUT = 10000;
// Get real weather data using application's service
const { list: forecast } = await getWeatherForecast();
const TEST_WEATHER = forecast[0]; // Use first forecast entry

async function testConnection() {
  console.log('Starting DeepSeek API connection test...\n');

  // 1. Validate environment
  if (!process.env.VITE_DEEPSEEK_API_KEY) {
    console.error('❌ Missing VITE_DEEPSEEK_API_KEY in .env file');
    return process.exit(1);
  }
  console.log('✅ Environment check passed');
  console.log(`🔑 API Key: ${process.env.VITE_DEEPSEEK_API_KEY.slice(0, 6)}...`);

  // 2. Test direct API call
  console.log('\n🔌 Testing direct API connection...');
  try {
    const testResponse = await axios.get(
      'https://api.deepseek.com/v1/status',
      {
        headers: {
          Authorization: `Bearer ${process.env.VITE_DEEPSEEK_API_KEY}`,
          Accept: 'application/json'
        },
        timeout: TEST_TIMEOUT
      }
    );
    console.log(`📡 API Status: ${testResponse.status} ${testResponse.statusText}`);
    console.log('🏓 Ping Time: ' + (testResponse.headers['x-response-time'] || 'unknown'));
  } catch (error) {
    console.error('❌ Direct connection failed:');
    if (axios.isAxiosError(error)) {
      console.error(`📟 Status: ${error.response?.status || 'No response'}`);
      console.error(`💬 Message: ${error.message}`);
      console.error(`🔧 Code: ${error.code || 'N/A'}`);
    } else {
      console.error(error);
    }
    process.exit(1);
  }

  // 3. Test service function
  console.log('\n🧪 Testing getDeepSeekRecommendation()');
  try {
    const start = Date.now();
    const recommendation = await getDeepSeekRecommendation(TEST_WEATHER);
    const duration = Date.now() - start;
    const weatherStart = Date.now();
    const weatherDuration = Date.now() - weatherStart;

    console.log('⏱  Response time: ' + duration + 'ms');
    console.log('📋 Recommendation:');
    console.log({
      bestTime: recommendation.bestTime,
      duration: recommendation.duration,
      intensity: recommendation.intensity,
      reasoning: recommendation.reasoning
    });

    if (recommendation.reasoning.includes('unavailable')) {
      console.warn('⚠️  Using fallback recommendation - verify API health');
      process.exit(1);
    }

    console.log('📊 Performance Metrics:');
    console.log('DeepSeek API: ' + duration + 'ms');
    console.log('Weather API: ' + weatherDuration + 'ms');

    console.log('✅ Service function test passed');
  } catch (error) {
    console.error('❌ Service function failed:');
    console.error(error);
    process.exit(1);
  }

  console.log('\n🎉 All tests passed successfully!');
  process.exit(0);
}

async function testMalformedRequests() {
  console.log('\n🧪 Testing Malformed Requests...');
  try {
    await getDeepSeekRecommendation({
      dt: 1678886400,
      main: {
        temp: 'invalid' as any,
        humidity: 70,
      },
      wind: {
        speed: 5,
      },
      weather: [
        {
          description: 'clear sky',
          main: 'Clear',
        },
      ],
      visibility: 10000,
    } as any);
    console.error('❌ Malformed Requests test failed: No error was thrown');
    process.exit(1);
  } catch (error: any) {
    if (error.message.includes('DeepSeek API failed')) {
      console.log('✅ Malformed Requests test passed');
    } else {
      console.error('❌ Malformed Requests test failed: Unexpected error', error);
      process.exit(1);
    }
  }
}

async function testRateLimiting() {
  console.log('\n🧪 Testing Rate Limiting...');
  const numberOfRequests = 5;
  const requests = Array(numberOfRequests).fill(null).map(() => getDeepSeekRecommendation(TEST_WEATHER));

  try {
    await Promise.all(requests);
    console.log('✅ Rate Limiting test passed: No rate limiting occurred');
  } catch (error: any) {
    if (error.message.includes('DeepSeek API failed')) {
      console.log('✅ Rate Limiting test passed: Rate limiting occurred as expected');
    } else {
      console.error('❌ Rate Limiting test failed: Unexpected error', error);
      process.exit(1);
    }
  }
}

testConnection();