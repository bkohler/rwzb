import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // Base URL for GitHub Pages
  base: '/rwzb/',
  server: {
    // Allow any host when accessed through ngrok
    host: '0.0.0.0',
    // hmr: {
    //   // Allow HMR from ngrok
    //   clientPort: 443,
    //   protocol: 'wss',
    // },
    // Enable CORS for development
    cors: true,
    // Allow all hosts (especially ngrok tunnels)
    // origin: 'http://localhost:5174',
    port: 5174,
    proxy: {
      '/api/deepseek': {
        target: 'https://api.deepseek.com/v1.2',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api\/deepseek/, '/recommendations'),
        configure: (proxy) => {
          // Add required CORS headers for development
          proxy.on('proxyRes', (proxyRes) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS';
            proxyRes.headers['Access-Control-Allow-Headers'] = 'Authorization,Content-Type,Accept-Version';
          });
        }
      }
    }
  }
})
