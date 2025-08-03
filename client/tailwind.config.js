/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-orange': {
          light: '#FFA726',
          dark: '#E65100',
        },
        'brand-background': '#FFFFFF',
        'brand-surface': '#F8F9FA',
        'brand-text': {
          primary: '#212529',
          secondary: '#6C757D',
        },
      },
    },
  },
  plugins: [],
};
