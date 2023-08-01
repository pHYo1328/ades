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
      keyframes: {
        shake: {
          '0%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-5deg)' },
          '50%': { transform: 'rotate(0deg)' },
          '75%': { transform: 'rotate(5deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        'car-move': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'shake-custom': 'shake 0.5s infinite',
        'car-move': 'car-move 2s linear infinite',
      },
    },
  },
  plugins: [],
};
