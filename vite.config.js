import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  define: {
    'process.env.REACT_APP_URL': JSON.stringify('http://localhost:5000/api/'),
  },

  optimizeDeps: {
    include: ['jwt-decode'],
  },
})
