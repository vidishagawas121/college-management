/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4f9',
          100: '#dde6f2',
          200: '#bfd1e6',
          300: '#94b4d6',
          400: '#6491c2',
          500: '#4173ad',
          600: '#2f5991',
          700: '#264775',
          800: '#1e385f',
          900: '#0f223f',
          950: '#091527',
        },
        academic: {
          navy: '#0f223f',
          blue: '#1e3a8a',
          gold: '#d97706',
          amber: '#b45309',
          crimson: '#991b1b',
          slate: '#334155',
          light: '#f8fafc',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Outfit', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
