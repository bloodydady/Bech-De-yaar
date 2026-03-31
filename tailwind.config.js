/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#1C2F5E',
          orange: '#F5A623',
          bg: '#F5F5F5',
          card: '#FFFFFF',
          error: '#E84040',
          success: '#22C55E'
        }
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
