import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Served from a custom domain root (dualsense-configurator.jzarzoso.com), so base is "/"
// If you ever drop the custom domain and go back to username.github.io/repo-name/, change this back
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
})
