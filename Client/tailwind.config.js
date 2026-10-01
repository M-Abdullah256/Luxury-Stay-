/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          dark: '#0B1120',       // Deep Royal Navy
          card: '#151F32',       // Dark Card Background
          gold: '#D4AF37',       // Signature Luxury Gold
          'gold-light': '#F3E5AB',
          'gold-dark': '#AA7C11',
          muted: '#94A3B8',      // Soft Slate Text
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}