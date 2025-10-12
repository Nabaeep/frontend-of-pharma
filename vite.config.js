import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173,
    open: true,
  },
  // ✅ Enable React Router history fallback
  preview: {
    port: 4173,
    open: true,
  },
})
