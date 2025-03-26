<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getSunTimes, getWeatherForecast, isGoodWeather, getWeatherSummary, getDeepSeekRecommendation, DeepSeekRecommendation } from './services/api';

const runningTime = ref('');
const weatherInfo = ref('');
const isLoading = ref(true);
const error = ref('');
const deepseekRecommendation = ref<DeepSeekRecommendation | null>(null);
const tomorrow = ref(new Date(new Date().getTime() + 24 * 60 * 60 * 1000));
const tomorrowDateString = ref(tomorrow.value.toLocaleDateString('de-CH', { 
  weekday: 'long', 
  day: 'numeric', 
  month: 'long',
  timeZone: 'Europe/Zurich'
}));

onMounted(async () => {
  try {
    console.log('App mounted, starting data fetch...');
    console.log('Environment:', import.meta.env.MODE);
    console.log('API Keys configured:', {
      weather: !!import.meta.env.VITE_WEATHER_API_KEY,
      deepseek: !!import.meta.env.VITE_DEEPSEEK_API_KEY
    });
    // Fetch both sunrise/sunset times and weather data for tomorrow
    const [sunTimes, weatherData] = await Promise.all([
      getSunTimes(true).catch(err => {
        console.error('Sun API Error:', err.response?.data || err.message);
        throw err;
      }),
      getWeatherForecast(true).catch(err => {
        console.error('Weather API Error:', err.response?.data || err.message);
        throw err;
      })
    ]);
    
    console.log('Sun Times:', sunTimes);
    console.log('Weather Data:', weatherData);
    
    if (!sunTimes?.results || !weatherData?.list) {
      throw new Error('Invalid API response format');
    }
    
    // Parse the sunrise and sunset times
    const sunriseDate = new Date(sunTimes.results.sunrise);
    const sunsetDate = new Date(sunTimes.results.sunset);
    
    // Add 30 minutes to sunrise
    const startTime = new Date(sunriseDate.getTime() + 30 * 60 * 1000);
    
    // Subtract 30 minutes from sunset
    const endTime = new Date(sunsetDate.getTime() - 30 * 60 * 1000);
    
    // Format times in Swiss format
    const formatTime = (date: Date) => {
      return date.toLocaleTimeString('de-CH', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'Europe/Zurich' 
      });
    };
    
    // Get the timestamp for tomorrow at 00:00
    const tomorrowStart = new Date();
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);
    tomorrowStart.setHours(0, 0, 0, 0);
    
    // Get the timestamp for tomorrow at 23:59
    const tomorrowEnd = new Date(tomorrowStart);
    tomorrowEnd.setHours(23, 59, 59, 999);
    
    // Filter forecast data to only include tomorrow's entries
    const tomorrowForecasts = weatherData.list.filter(entry => {
      const entryTime = new Date(entry.dt * 1000);
      return entryTime >= tomorrowStart && entryTime <= tomorrowEnd;
    });
    
    // Find good weather periods within the daylight window for tomorrow
    const goodWeatherPeriods = tomorrowForecasts.filter(entry => {
      const entryTime = new Date(entry.dt * 1000);
      return entryTime >= startTime && 
             entryTime <= endTime && 
             isGoodWeather(entry);
    });
    
    if (goodWeatherPeriods.length > 0) {
      // If we have good weather periods, use the first one for display
      const bestPeriod = goodWeatherPeriods[0];
      const bestPeriodTime = new Date(bestPeriod.dt * 1000);
      
      // Create a 2-hour window starting at the good weather time
      const windowEnd = new Date(bestPeriodTime.getTime() + 2 * 60 * 60 * 1000);
      
      // Make sure the window doesn't exceed daylight end
      const actualEnd = windowEnd > endTime ? endTime : windowEnd;
      
      runningTime.value = `${formatTime(bestPeriodTime)} - ${formatTime(actualEnd)}`;
      weatherInfo.value = getWeatherSummary(bestPeriod);
        // Get DeepSeek recommendation
        const recommendation = await getDeepSeekRecommendation(bestPeriod);
        deepseekRecommendation.value = recommendation;
    } else {
      // If no good weather, just display the daylight window
      runningTime.value = `${formatTime(startTime)} - ${formatTime(endTime)}`;
      weatherInfo.value = 'No optimal weather conditions found';
    }
  } catch (err: any) {
    if (err.message && err.message.includes('DeepSeek API failed')) {
      error.value = 'Failed to get DeepSeek recommendation';
    } else if (err instanceof Error) {
      error.value = `Error: ${err.message}`;
    } else {
      error.value = 'Failed to determine optimal running time';
    }
    console.error('Detailed error:', err);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div style="min-height: 100vh; background-color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1rem;">
    <ErrorBoundary>
      <div style="text-align: center;">
        <h1>Zugerberg Running Time</h1>
        <div v-if="isLoading">
          <p style="font-size: 1.25rem; color: black;">Loading data...</p>
        </div>
        <div v-else-if="error">
          <p style="font-size: 1.25rem; color: red;">Error: {{ error }}</p>
          <p style="font-size: 1rem; color: #666;">Check console for details and ensure API keys are configured</p>
        </div>
        <div v-else>
          <p v-if="runningTime" style="font-size: 1.25rem; color: black;">Best time to run tomorrow: {{ runningTime }}</p>
          <p v-else style="font-size: 1.25rem; color: black;">No running time data available</p>
          <p style="font-size: 0.875rem; color: #666; margin-top: 0.5rem;">{{ tomorrowDateString }}</p>
          <div v-if="deepseekRecommendation" class="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 class="text-lg font-semibold mb-2">Running Recommendation</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600">Best Time</p>
                <p class="font-medium">{{ deepseekRecommendation.bestTime }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Duration</p>
                <p class="font-medium">{{ deepseekRecommendation.duration }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Intensity</p>
                <p class="font-medium">{{ deepseekRecommendation.intensity }}</p>
              </div>
            </div>
            <p class="mt-3 text-sm text-gray-600 italic">
              {{ deepseekRecommendation.reasoning }}
            </p>
          </div>
          <p style="font-size: 0.875rem; color: #666; margin-top: 0.5rem;">{{ weatherInfo }}</p>
        </div>
      </div>
    </ErrorBoundary>
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}
</style>
