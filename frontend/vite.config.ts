import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    watch: { usePolling: true },
    proxy: {
      '/api': 'http://backend:3000',
      '/socket.io': { target: 'http://backend:3000', ws: true },
    },
  },
})
