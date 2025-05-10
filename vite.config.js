import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  base: '/booklovecoffe/',
  build: {
    outDir: 'dist',
    copyPublicDir: true, // public klasörünün kopyalanmasını sağlar
  },
})
