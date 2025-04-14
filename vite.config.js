import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['redux-thunk']
  },
  server: {
    host: true, // Enables access from network
    allowedHosts: ['localhost', '127.0.0.1', 'related-tapir-outgoing.ngrok-free.app', 'money-manager-frontend.onrender.com'],
    historyApiFallback: true, // Handle client-side routing in development
  },
  // Add this section for production SPA routing
  build: {
    outDir: 'dist',
    // Generate SPA fallback for client-side routing
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})