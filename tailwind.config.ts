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
          bg:       '#f8faf8',
          surface:  '#ffffff',
          surface2: '#f0f5f0',
          glass:    'rgba(255,255,255,0.75)',
          border:   'rgba(26,92,42,0.12)',
          accent:   '#1a5c2a',
          highlight:'#2e9e4f',
          bright:   '#4ccd6e',
          muted:    '#e8f5eb',
          text:     '#0f1f12',
          subtext:  '#4a6b52',
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
