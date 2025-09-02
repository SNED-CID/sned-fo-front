const { withRTL } = require('tailwindcss-rtl');

// tailwind.config.js
module.exports = withRTL({
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        sned: {
          blue: "#139dcc",
          orange: "#f89851",
        },
      },
    },
  },
  plugins: [],
});
