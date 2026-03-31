/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        rose: {
          50: '#fdf8f5',
          100: '#f8ede7',
          200: '#f2dcd1',
          300: '#e6c0ad',
          400: '#d99e83',
          500: '#cf7f60',
          600: '#bf6a4a',
          700: '#a0573d',
          800: '#844a36',
          900: '#6e4030',
          950: '#3b2018',
        },
        cream: '#fdf9f6',
        'cream-dark': '#f3ede7',
        gold: '#c0a47e',
        'gold-light': '#ddd0b8',
        'warm-dark': '#2c2220',
        'warm-gray': '#6b5b55',
        'warm-light': '#9a8e88',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['Jost', 'sans-serif'],
      },
      boxShadow: {
        rose: '0 4px 20px -2px rgba(207, 127, 96, 0.12)',
        'rose-lg': '0 10px 40px -4px rgba(207, 127, 96, 0.18)',
      },
    },
  },
  plugins: [],
}
