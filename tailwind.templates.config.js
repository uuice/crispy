/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/server/templates/**/*.{njk,html,js,ts,css}"
  ],
  theme: {
    extend: {
      darkMode: "class",
      fontFamily: {
        sans: ["Roboto", "sans-serif", "Inter", "system-ui"],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
