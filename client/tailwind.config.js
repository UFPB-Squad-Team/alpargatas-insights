/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1E3A8A',
          secondary: '#78350F',
          accent: '#D97706',
          background: '#FDFBF6',
          surface: '#FFFFFF',
          'accent-dark': '#B45309',
          text: {
            primary: '#1F2937',
            secondary: '#6B7280',
            muted: '#9CA3AF',
          },
        },
        risk: {
          critical: '#78350F', // bronze profundo (grave)
          high: '#D97706', // laranja da paleta (alto)
          medium: '#B45309', // dourado queimado (médio)
          low: '#9CA3AF', // cinza suave (baixo)
        },
      },

      keyframes: {
        wave: {
          '0%, 100%': { transform: 'scaleY(0.5)', opacity: '0.4' },
          '50%': { transform: 'scaleY(1)', opacity: '1' },
        },
      },
      animation: {
        wave: 'wave 1.2s linear infinite',
      },
    },
  },
  plugins: [],
};
