module.exports = {
  plugins: {
    '@tailwindcss/postcss': {
      content: ['./src/**/*.{html,ts}'],
    },
    autoprefixer: {},
  },
};