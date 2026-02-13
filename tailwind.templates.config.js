/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/server/templates/**/*.{tsx,html,js,ts,css}"
  ],
  darkMode: "class",
  theme: {
    extend: {
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
