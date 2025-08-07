module.exports = {
  plugins: [
    'postcss-import',
    ['tailwindcss', { config: './tailwind.templates.config.js' }],
    'autoprefixer',
    ...(process.env.NODE_ENV === 'production' ? ['cssnano'] : [])
  ]
}
