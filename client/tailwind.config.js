/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wedding: {
          gold: '#C5A880',
          'gold-dark': '#A08055',
          'gold-light': '#F4EFEA',
          cream: '#FDFBF7',
          rose: '#E8D3D1',
          'rose-dark': '#B87D7A',
          sage: '#98A89E',
          'sage-dark': '#5C7164',
          charcoal: '#2D312E',
          sand: '#ECE7E1'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        cursive: ['"Great Vibes"', 'cursive'],
        sans: ['"Inter"', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
