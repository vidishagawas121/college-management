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
          50: '#fff6e9',
          100: '#f8dfd9',
          200: '#f2d28b',
          300: '#d9a441',
          400: '#f06a5b',
          500: '#b95a58',
          600: '#7a2846',
          700: '#541c2e',
          800: '#3b1120',
          900: '#2b2024',
          950: '#1b1517',
        },
        academic: {
          navy: '#541c2e',
          blue: '#7a2846',
          gold: '#d9a441',
          amber: '#f2d28b',
          crimson: '#c53030',
          slate: '#74666b',
          light: '#fff6e9',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 10px 30px rgba(84, 28, 46, 0.08)',
        premium: '0 18px 45px rgba(84, 28, 46, 0.12)',
      },
    },
  },
  plugins: [],
}
