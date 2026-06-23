import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

// Minimal Astro config for static site
export default defineConfig({
  outDir: 'dist',
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        usePolling: true
      }
    }
  }
})
