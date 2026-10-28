import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const src = (dir) => fileURLToPath(new URL(`./src/${dir}`, import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Lets imports like 'components/Button' resolve from src/ (replaces CRA's NODE_PATH=src/)
    alias: {
      api: src('api'),
      components: src('components'),
      db_models: src('db_models'),
      models: src('models'),
      views: src('views'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5000',
      '/socket.io': { target: 'http://localhost:5000', ws: true },
    },
  },
  build: {
    // server.js serves client/dist in production
    outDir: 'dist',
    sourcemap: false,
  },
});
