import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#F8FAFC',
        foreground: '#0F172A',
        card: '#FFFFFF',
        border: '#E5E7EB',
        primary: {
          DEFAULT: '#2563EB',
          foreground: '#FFFFFF'
        },
        accent: {
          DEFAULT: '#0EA5A4',
          foreground: '#FFFFFF'
        },
        success: '#16A34A',
        warning: '#F59E0B',
        danger: '#DC2626'
      },
      borderRadius: {
        xl: '12px'
      },
      boxShadow: {
        soft: '0 6px 24px rgba(15, 23, 42, 0.08)'
      }
    }
  },
  plugins: []
} satisfies Config;
