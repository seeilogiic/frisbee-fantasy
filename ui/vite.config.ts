import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path for GitHub Pages - update this to match your repository name
  // If your repo is at github.com/username/frisbee-fantasy, use '/frisbee-fantasy/'
  // If deploying to root domain, use '/'
  base: process.env.VITE_BASE_PATH || '/',
  resolve: {
    alias: {
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
    },
  },
})
