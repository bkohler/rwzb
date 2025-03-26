import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3333;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Get DEEPSEEK_API_KEY from .env file
const deepseekApiKey = process.env.VITE_DEEPSEEK_API_KEY;
if (!deepseekApiKey) {
  console.error('VITE_DEEPSEEK_API_KEY not found in environment variables');
  process.exit(1);
}

// Debug route to check if server is alive
app.get('/', (req, res) => {
  res.send('DeepSeek proxy server is running');
});

// Debug endpoint to check request structure
app.get('/api/deepseek', (req, res) => {
  res.json({ status: 'DeepSeek API proxy endpoint is available' });
});

// Mock data for testing
const mockDeepSeekResponse = {
  optimal_time: "8:00 AM - 10:00 AM",
  recommended_duration: "45-60 minutes",
  intensity_level: "Moderate",
  explanation: "Morning temperatures are ideal with low wind. The humidity level is comfortable for sustained activity."
};

// Proxy endpoint for DeepSeek API
app.post('/api/deepseek', async (req, res) => {
  // Use mock data since the API endpoint isn't available
  console.log('Using mock data because the actual DeepSeek API endpoint does not exist');
  return res.json(mockDeepSeekResponse);
  
  try {
    console.log('Received DeepSeek API request:', req.body);
    
    const url = 'https://api.deepseek.com/v1.2/recommendations';
    console.log('Forwarding to DeepSeek API at:', url);
    console.log('Using API key:', deepseekApiKey.substring(0, 5) + '...');
    
    try {
      const response = await axios.post(url, 
        req.body,
        {
          headers: {
            'Authorization': `Bearer ${deepseekApiKey}`,
            'Content-Type': 'application/json',
            'Accept-Version': '1.2.0'
          },
          timeout: 15000
        }
      );
      
      console.log('DeepSeek API response:', response.data);
      res.json(response.data);
    } catch (error) {
      console.error('Error in DeepSeek API call:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        res.status(error.response.status).json({
          error: error.response.data || 'Error from DeepSeek API',
          status: error.response.status,
          statusText: error.response.statusText
        });
      } else {
        console.error('Error details:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
      }
    }
  } catch (error) {
    console.error('Error in proxy server:', error.message);
    res.status(500).json({ error: 'Proxy Server Error', details: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});