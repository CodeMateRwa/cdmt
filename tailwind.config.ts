import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        codemate: {
          bg:       '#fdfefd',
          surface:  '#ffffff',
          surface2: '#f4f9f4',
          glass:    'rgba(255,255,255,0.85)',
          border:   'rgba(14,64,45,0.08)',
          accent:   '#0e402d', // Deep Forest
          highlight:'#1a5c2a',
          bright:   '#2d6a4f',
          muted:    '#ecf3f0',
          text:     '#051a12',
          subtext:  '#2d4a3e',
          white:    '#ffffff',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans:    ['"Plus Jakarta Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
