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
    },
  },
  plugins: [],
};
