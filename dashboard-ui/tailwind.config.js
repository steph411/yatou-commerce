const colors = require("tailwindcss/colors");

module.exports = {
  // purge: [],
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "light-blue": colors.lightBlue,
        orange: colors.orange,
        "cool-gray": colors.coolGray,
        "cold-gray": colors.blueGray,
        brand: "var(--brand-color)",
        "background-light": "var(--background-light)",
        "background-darker": "var(--background-darker)",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
