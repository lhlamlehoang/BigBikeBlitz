import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // allowedHosts: ['bigbikeblitz-production.up.railway.app'],
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
}); 