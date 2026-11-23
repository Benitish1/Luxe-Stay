import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0E0D0B',
          900: '#0E0D0B',
          800: '#16140F',
          700: '#211E18',
          600: '#2E2A22',
          500: '#4A443A',
        },
        ivory: {
          DEFAULT: '#F7F3EC',
          50: '#FCFAF6',
          100: '#F7F3EC',
          200: '#EFE8DC',
          300: '#E3D9C8',
        },
        gold: {
          DEFAULT: '#C6A15B',
          300: '#E6CF9F',
          400: '#D7B97C',
          500: '#C6A15B',
          600: '#A9843F',
          700: '#86672F',
        },
        stone: { 450: '#8A8274' },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: { luxe: '0.28em' },
      boxShadow: {
        luxe: '0 30px 60px -20px rgba(14, 13, 11, 0.35)',
        soft: '0 10px 30px -12px rgba(14, 13, 11, 0.18)',
      },
      keyframes: {
        fadeUp: { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'none' } },
        kenburns: { from: { transform: 'scale(1)' }, to: { transform: 'scale(1.12)' } },
        slideIn: { from: { transform: 'translateX(100%)' }, to: { transform: 'none' } },
      },
      animation: {
        fadeUp: 'fadeUp .9s cubic-bezier(.2,.7,.2,1) both',
        kenburns: 'kenburns 18s ease-out both',
        slideIn: 'slideIn .35s cubic-bezier(.2,.7,.2,1) both',
      },
    },
  },
  plugins: [],
};
export default config;
