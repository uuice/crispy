/** @type {import('postcss-load-config').Config} */
module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-nested': {},
    'postcss-nesting': {},
    'tailwindcss': { config: './tailwind.templates.config.js' },
    'autoprefixer': {},
    ...(process.env.NODE_ENV === 'production' ? { 'cssnano': {} } : {})
  },
  // Enable source maps
  map: process.env.NODE_ENV === 'development'
    ? 'inline'
    : process.env.NODE_ENV === 'production'
      ? { inline: false, annotation: true }
      : false
}
