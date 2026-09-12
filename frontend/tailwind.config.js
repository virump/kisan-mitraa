/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f9f3',
          100: '#e1f2e5',
          200: '#c3e5cb',
          300: '#94cf9f',
          400: '#5fb270',
          500: '#3b964d',
          600: '#2c7a3b',
          700: '#246131',
          800: '#1f4e2a',
          900: '#1a4124',
          950: '#0c2312',
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        earth: {
          50: '#fbf8f5',
          100: '#f5efe8',
          200: '#eadfd3',
          500: '#8c6b4f',
          800: '#4a3828',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 10px 25px -5px rgba(44, 122, 59, 0.08)',
      }
    },
  },
  plugins: [],
}
