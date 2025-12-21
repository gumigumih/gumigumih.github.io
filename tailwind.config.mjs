/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx,vue,svelte}',
    './public/**/*.html'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Raleway', 'M PLUS 1p', 'sans-serif']
      }
    }
  },
  plugins: []
}
