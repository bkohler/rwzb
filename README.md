# Running Weather Zone Backend (RWZB)

## Project Overview
Vue.js application that recommends optimal running times based on weather conditions.

## Security Best Practices

1. **API Keys Management**:
   - Never commit API keys to version control
   - Use `.env` file for local development
   - Add `.env` to `.gitignore`
   - Rotate keys immediately if exposed

2. **Environment Setup**:
   ```bash
   # Create .env file from example
   cp .env.example .env
   # Add your actual API keys to .env
   ```

3. **If Keys Are Exposed**:
   - Immediately rotate all exposed keys
   - Force push to overwrite git history
   - Audit commit history for other sensitive data

4. **Testing**:
   - Use mock keys in test files
   - Never use production keys in tests

## GitHub Pages Deployment

1. **Set up GitHub Secrets**:
   - Go to Repository Settings > Secrets > Actions
   - Add these secrets:
     - `WEATHER_API_KEY`: Your OpenWeatherMap API key
     - `DEEPSEEK_API_KEY`: Your DeepSeek API key

2. **Deployment**:
   - Pushes to `main` branch will automatically deploy to GitHub Pages
   - The app will be available at: `https://[your-username].github.io/rwzb/`

3. **Troubleshooting**:
   - Check Actions tab for deployment logs
   - Ensure base URL in vite.config.ts matches your repo name

## Incident Report (2025-03-26)
- Exposed API keys in git history
- Remediation steps taken:
  - Removed .env from tracking
  - Force pushed to overwrite history
  - Keys rotated
  - Security documentation added
