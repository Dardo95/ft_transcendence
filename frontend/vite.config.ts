import fs from 'node:fs';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'node:path';

const isRunningInDocker = fs.existsSync('/.dockerenv');
const apiProxyTarget =
  process.env.VITE_API_PROXY_TARGET ??
  (isRunningInDocker ? 'http://backend:3000' : 'http://localhost:3000');

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      '@transcendence/shared': path.resolve(
        import.meta.dirname,
        '../shared/src'
      ),
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    watch: { usePolling: true },
    proxy: {
      '/api': apiProxyTarget,
      '/socket.io': { target: apiProxyTarget, ws: true },
    },
  },
});
