import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

// Minimal Astro config for static site
export default defineConfig({
  outDir: 'dist',
  vite: {
    plugins: [tailwindcss()],
    build: {
      assetsInlineLimit: 0
    },
    server: {
      watch: {
        usePolling: true
      }
    }
  }
})
