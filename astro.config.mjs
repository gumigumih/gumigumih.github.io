import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'

// Minimal Astro config for static site
export default defineConfig({
  outDir: 'dist',
  integrations: [tailwind()],
  vite: {
    server: {
      watch: {
        usePolling: true
      }
    }
  }
})
