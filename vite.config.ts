import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // Base URL for GitHub Pages
  base: '/rwzb/',
  server: {
    // Allow any host when accessed through ngrok
    host: '0.0.0.0',
    hmr: {
      // Allow HMR from ngrok
      clientPort: 443,
      protocol: 'wss',
    },
    // This fixes the "Blocked request" error
    cors: true,
    // Allow all hosts (especially ngrok tunnels)
    origin: '*'
  },
  // Add additional config to fix specific issues with ngrok
  preview: {
    host: true,
    strictPort: true,
  },
})
