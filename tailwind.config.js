/* eslint-disable node/no-unpublished-require */
module.exports = {
  content: [
    './pages/_app.tsx',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'media',
  theme: {
    minWidth: {
      40: '10rem',
      60: '15rem',
      80: '20rem',
      100: '25rem',
    },
    maxWidth: {
      120: '30rem',
      160: '40rem',
      200: '50rem',
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-textshadow'),
  ],
}
