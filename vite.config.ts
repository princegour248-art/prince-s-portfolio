import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/prince-s-portfolio/',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200
  }
})
