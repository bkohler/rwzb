# Real API Integration Plan

## Phase 1: API Layer Improvements
1. **Remove mock fallbacks** from `api.ts`
   - Delete lines 122-127 and 165-170
   - Replace with error throwing:
     ```typescript
     throw new Error('Invalid weather data for recommendations');
     ```
     ```typescript
     throw new Error(`DeepSeek API failed: ${error.message}`);
     ```

2. **Enhance error handling**:
   ```typescript
   // Add error types
   export class APIError extends Error {
     readonly isOperational: boolean;
     
     constructor(message: string, isOperational: boolean) {
       super(message);
       this.isOperational = isOperational;
     }
   }

   // Update error handling
   catch (error) {
     if (axios.isAxiosError(error)) {
       throw new APIError(
         `DeepSeek API Error: ${error.response?.statusText}`, 
         error.response?.status >= 500
       );
     }
     throw new APIError('Unknown API Error', false);
   }
   ```

## Phase 2: Testing Infrastructure
1. **Update test-deepseek.ts**:
   ```typescript
   // Replace MOCK_WEATHER with real API call
   const realWeather = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LNG}&appid=${process.env.VITE_WEATHER_API_KEY}`);
   
   // Add error boundary tests
   await testMalformedRequests();
   await testRateLimiting();
   ```

2. **Add monitoring**:
   ```typescript
   // Track API response times
   console.log('📊 Performance Metrics:');
   console.table({
     'DeepSeek API': `${duration}ms`,
     'Weather API': `${weatherDuration}ms`
   });
   ```

## Phase 3: UI Error Handling
1. **Review App.vue** for:
   - Proper error catching in async calls
   - User-friendly error messages
   - Loading states

## Validation Checklist
- [ ] All mock data removed from service layer
- [ ] API errors propagate to UI
- [ ] Test script uses real weather data
- [ ] Location remains fixed to Zugerberg
- [ ] .env contains valid production keys