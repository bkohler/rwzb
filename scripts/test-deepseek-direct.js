import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

if (!process.env.VITE_DEEPSEEK_API_KEY) {
  console.error('Error: VITE_DEEPSEEK_API_KEY is not set in environment variables');
  process.exit(1);
}

const deepseek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.VITE_DEEPSEEK_API_KEY
});

const systemPrompt = `You are an expert running coach. Based on weather conditions, suggest optimal running parameters including:
- Best time window (morning/afternoon/evening)
- Recommended duration
- Training intensity
- Detailed reasoning considering temperature, humidity, wind and conditions
Return response as JSON with: bestTime, duration, intensity, reasoning`;

async function getRecommendation(weather) {
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
}

async function test() {
  try {
    const weather = {
      main: { temp: 18.5, humidity: 65 },
      wind: { speed: 2.5 },
      weather: [{ description: 'clear sky', main: 'Clear' }]
    };

    console.log('Testing DeepSeek API...');
    const result = await getRecommendation(weather);
    
    console.log('Recommendation:', result);
    console.log('✅ Test passed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

test();