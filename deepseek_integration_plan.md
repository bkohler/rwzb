# DeepSeek API Integration Plan

## 1. Setup
```bash
npm install openai
```

## 2. API Configuration
Add to `src/services/api.ts`:
```typescript
const deepseek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY
});
```

## 3. Prompt Design
System message:
```
"You are an expert running coach. Based on weather conditions, suggest optimal running parameters including:
- Best time window (morning/afternoon/evening)
- Recommended duration
- Training intensity
- Detailed reasoning considering temperature, humidity, wind and conditions
Return response as JSON with: bestTime, duration, intensity, reasoning"
```

## 4. Implementation
Modify `getDeepSeekRecommendation`:
```typescript
export async function getDeepSeekRecommendation(
  weather: WeatherData
): Promise<DeepSeekRecommendation> {
  try {
    const prompt = `Current weather:
    - Temperature: ${weather.main.temp}°C
    - Humidity: ${weather.main.humidity}%
    - Wind: ${weather.wind.speed} m/s
    - Conditions: ${weather.weather[0].description}`;

    const completion = await deepseek.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      model: "deepseek-chat",
      response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('DeepSeek API Error:', error);
    throw new APIError('DeepSeek API failed', true);
  }
}
```

## 5. Error Handling
- Add retry logic for transient failures
- Implement fallback to basic recommendations if API fails
- Add input validation

## 6. Environment Variables
Add to `.env`:
```
VITE_DEEPSEEK_API_KEY=your_api_key_here
```

## Implementation Steps
1. [ ] Add OpenAI SDK
2. [ ] Configure API client
3. [ ] Design and test prompts
4. [ ] Implement new function
5. [ ] Add error handling
6. [ ] Update documentation