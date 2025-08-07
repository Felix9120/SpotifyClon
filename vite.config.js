import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server: {
    host: '127.0.0.1',
    port: 5173, // Asegura que se mantenga el mismo puerto que registraste en Spotify
  },
})
