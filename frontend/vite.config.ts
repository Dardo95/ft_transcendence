import fs from 'node:fs'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const isRunningInDocker = fs.existsSync('/.dockerenv')
const apiProxyTarget =
  process.env.VITE_API_PROXY_TARGET ??
  (isRunningInDocker ? 'http://backend:3000' : 'http://localhost:3000')

export default defineConfig({
  plugins: [react()],
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
})

/*
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    watch: { usePolling: true },
    proxy: {
      '/api': 'http://backend:3000',
      '/socket.io': { target: 'http://backend:3000', ws: true },
    },
  },
})
 */