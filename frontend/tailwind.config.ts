import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sentinel: {
          primary: '#0F1923',
          surface: '#162032',
          accent: '#FF4B1F',
          safe: '#00D084',
          warning: '#FFB800',
          critical: '#FF1744',
          text: '#E8EDF2',
          muted: '#6B8096',
          border: '#1E3048',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        pulseCritical: {
          '0%, 100%': { borderColor: '#FF1744', boxShadow: '0 0 15px rgba(255, 23, 68, 0.4)' },
          '50%': { borderColor: '#1E3048', boxShadow: 'none' },
        },
      },
      animation: {
        'pulse-critical': 'pulseCritical 1.5s infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
