import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#a28b5d',
        'background-light': '#fbfaf9',
        'background-dark': '#1a1a1a',
        nude: '#EFEBE6',
        charcoal: '#151513',
        'gold-soft': '#D4AF37',
      },
      fontFamily: {
        sans: ['var(--font-assistant)', 'sans-serif'],
        noto: ['var(--font-noto-hebrew)', 'sans-serif'],
        display: ['var(--font-bellefair)', 'serif'],
        logo: ['var(--font-space-grotesk)', 'sans-serif'],
      },
      animation: {
        'slow-zoom': 'slow-zoom 20s ease-in-out infinite alternate',
      },
      keyframes: {
        'slow-zoom': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
