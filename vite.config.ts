import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: './', // Use relative paths to prevent 404 errors on GitHub Pages, Netlify, Vercel, and local previews
  plugins: [
    react(),
    tailwindcss(),
  ],
})
