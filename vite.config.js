import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Prerender from 'vite-plugin-prerender'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Prerender({
      // REQUIRED - The path to the vite-output build directory to prerender.
      staticDir: path.join(__dirname, 'dist'),
      // REQUIRED - Routes to render.
      routes: ['/', '/browse', '/notes', '/about'],
    }),
  ],
})
