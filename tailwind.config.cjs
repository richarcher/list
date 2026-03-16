/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        primary: '#aa3bff',
        'primary-focus': '#9333ea',
        'base-content': { DEFAULT: '#6b6375', 900: '#08060d' }
      },
      fontFamily: {
        sans: ['system-ui', 'Segoe UI', 'Roboto', 'sans-serif']
      }
    }
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          primary: '#aa3bff',
          'primary-content': '#ffffff',
          'primary-focus': '#9333ea',
          'base-content': '#6b6375',
          'base-100': '#ffffff',
          'base-200': '#f4f3ec',
          'base-300': '#e5e4e7'
        }
      },
      {
        dark: {
          primary: '#c084fc',
          'primary-content': '#ffffff',
          'primary-focus': '#a855f7',
          'base-content': '#9ca3af',
          'base-100': '#16171d',
          'base-200': '#1f2028',
          'base-300': '#2e303a'
        }
      }
    ],
    darkTheme: 'dark'
  }
}
