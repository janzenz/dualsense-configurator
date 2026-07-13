import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Change this to match your repo name for GitHub Pages
// e.g. "/repo-name/" for project pages, "/" for user/org pages
export default defineConfig({
  base: '/dualsense-configurator/',
  plugins: [react(), tailwindcss()],
})
