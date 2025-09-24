import { fontFamily } from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      safelist: [
        'text-orange-900',
        'text-orange-700',
        'text-orange-500',
        'bg-orange-900',
        'bg-orange-700',
        'bg-orange-500',
        'bg-orange-300',
      ],
      colors: {
        'brand-orange': {
          light: '#FFA726',
          dark: '#D46419',
          contrast: '#963B14',
        },
        'brand-background': '#FFFFFF',
        'brand-surface': '#F8F9FA',
        'brand-text': {
          primary: '#212529',
          secondary: '#6C757D',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
      },
      gridTemplateColumns: {
        40: 'repeat(40, minmax(0, 1fr))', // 👈 agora tá no lugar certo
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.brand-text.primary'),
            a: { color: theme('colors.brand-orange.dark') },
            strong: { color: theme('colors.brand-orange.dark') },
            h1: { color: theme('colors.brand-text.primary') },
            h2: { color: theme('colors.brand-text.primary') },
            h3: { color: theme('colors.brand-text.primary') },
            h4: { color: theme('colors.brand-text.primary') },
            h5: { color: theme('colors.brand-text.primary') },
            h6: { color: theme('colors.brand-text.primary') },
            blockquote: { color: theme('colors.brand-text.secondary') },
            code: { color: theme('colors.brand-orange.dark') },
          },
        },
        dark: {
          css: {
            color: theme('colors.brand-text.secondary'),
            a: { color: theme('colors.brand-orange.light') },
            strong: { color: theme('colors.brand-orange.light') },
            h1: { color: theme('colors.brand-text.secondary') },
            h2: { color: theme('colors.brand-text.secondary') },
            h3: { color: theme('colors.brand-text.secondary') },
            h4: { color: theme('colors.brand-text-secondary') },
            h5: { color: theme('colors.brand-text-secondary') },
            h6: { color: theme('colors.brand-text-secondary') },
            blockquote: { color: theme('colors.brand-text-primary') },
            code: { color: theme('colors.brand-orange.light') },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography'), require('tailwindcss-animate')],
}
