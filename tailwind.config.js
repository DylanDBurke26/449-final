/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    screens :{
      'sm': {'max': '1111px'},
      'md': {'max': '1667px'},
    },
  },
  plugins: [],
}

