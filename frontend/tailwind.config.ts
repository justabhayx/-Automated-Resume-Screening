/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#050505',
        cyan: {
          DEFAULT: '#00f3ff',
          glow: 'rgba(0, 243, 255, 0.5)',
        },
        violet: {
          DEFAULT: '#8a2be2',
          glow: 'rgba(138, 43, 226, 0.5)',
        },
        cyberGreen: '#00ff41',
        neonMagenta: '#ff00ff',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'cyan-glow': '0 0 20px rgba(0, 243, 255, 0.3)',
        'violet-glow': '0 0 20px rgba(138, 43, 226, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backgroundImage: {
        'scanlines': 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px)',
      },
    },
  },
  plugins: [],
}
