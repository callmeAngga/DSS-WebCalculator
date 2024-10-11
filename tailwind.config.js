/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/styles/**/*.css",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1A3636',
        secondary: '#40534C',
        tertiary: '#677D6A',
        accent: '#D6BD98',

        primaryHover: '#1A3616'
      },
    },
  },
  plugins: [],
}

