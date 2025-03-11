# Best Running Time on Zugerberg

A simple web app that displays the best running time on Zugerberg for tomorrow based on daylight and weather conditions. The app has no options or user input — it simply calculates and presents the optimal time frame for running.

## Features

- **Automatic Daylight Calculation**
  - Fetches sunrise and sunset times for Zugerberg automatically 
  - Calculates the daylight window:
    - Start: 30 minutes after sunrise
    - End: 30 minutes before sunset
  - Displays the time in Swiss time format (CET/CEST)

- **Weather Forecast Integration**
  - Fetches tomorrow's weather forecast for Zugerberg
  - Analyzes temperature, precipitation, wind speed, and visibility
  - Recommends a 2-hour window with the best weather conditions
  - Shows weather summary (temperature and conditions)

- **Minimal UI**
  - White background, black text
  - Displays the optimal running time and weather information
  - Shows the date for tomorrow
  - No buttons, no settings

- **Timezone Handling**
  - Automatically adjusts to CET/CEST (Swiss time zone)

## Data Sources

- [Sunrise-Sunset API](https://sunrise-sunset.org/api) for daylight data
- [OpenWeatherMap API](https://openweathermap.org/api) for weather forecasts

## Technology

- Vue 3 with TypeScript (Composition API)
- Vite for fast bundling and development
- TailwindCSS for styling
- Axios for API requests

## Running the App

```bash
# Copy .env.example to .env and add your OpenWeatherMap API key
cp .env.example .env

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Sharing with ngrok

The repository includes a convenient script for sharing your local development server:

```bash
# Share your app with a public URL
./share-app.sh
```

## GitHub Pages Deployment

This app is automatically deployed to GitHub Pages when changes are pushed to the main branch.
