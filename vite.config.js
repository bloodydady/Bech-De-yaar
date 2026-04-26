import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendors': ['react', 'react-dom', 'react-router-dom'],
          'firebase-vendors': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage', 'firebase/database'],
          'ui-vendors': ['lucide-react', 'react-hot-toast']
        }
      }
    }
  }
})
