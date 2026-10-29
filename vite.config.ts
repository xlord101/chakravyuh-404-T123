import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    watch: {
      ignored: [
        '**/*.mp4',
        '**/*.pdf',
        '**/*.png',
        '**/*.jpg',
        '**/*.jpeg',
        '**/.git/**',
        '**/dist/**',
        '**/node_modules/**'
      ]
    }
  }
})
