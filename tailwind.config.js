/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['IBM Plex Sans Arabic', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          950: '#050505',
          900: '#0a0a0a',
          850: '#0f0f0f',
          800: '#141414',
          700: '#1c1c1c',
        },
        gold: {
          200: '#f0dca6',
          300: '#e4c57f',
          400: '#d4b06a',
          500: '#c9a14a',
          600: '#a88236',
          700: '#7a5d24',
        },
      },
    },
  },
  plugins: [],
};
