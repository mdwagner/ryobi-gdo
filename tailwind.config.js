module.exports = {
  mode: "jit",
  purge: ["src/**/*.{js,jsx,ts,tsx}", "public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      xs: "0",
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preFlight: false,
  },
};
