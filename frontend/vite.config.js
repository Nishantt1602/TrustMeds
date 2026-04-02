import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Tailwind v4 Plugin

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // In v4, we use the Vite plugin directly
  ],
})