/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        breezeRegular: ['Breeze-Regular', 'sans-serif'],
        breezeBold: ['Breeze-Bold', 'sans-serif'],
      },
      colors: {
        peach: '#D8C4B6',
        grey: '#F5EFE7',
        'light-blue': '#4F709C',
        'dark-blue': '#213555',
        tertiary: '#2A2F4F',
      },
    },
  },
  plugins: [],
};
