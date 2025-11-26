import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Frontend dev server port
    strictPort: false, // If 5173 is taken, try next available port
  },
})

