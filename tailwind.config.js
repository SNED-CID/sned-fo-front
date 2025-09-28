/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        sned: {
          blue: "#139dcc",
          orange: "#f89851",
        },
      },
      fontFamily: {
        'nunito': ['Nunito Sans', 'sans-serif'],
        'cairo': ['Cairo', 'sans-serif'],
      },
      fontWeight: {
        'regular': '400',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
      }
    },
  },
  plugins: [],
}