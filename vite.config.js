import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import apiApp from './api/index.js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-dev-middleware',
      configureServer(server) {
        server.middlewares.use(apiApp);
      }
    }
  ],
  server: {
    host: '0.0.0.0',
    port: 3000
  }
});
