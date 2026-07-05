/**
 * Compile each theme tailwind.css (+ nested styles.css) to public/theme-assets/{id}.css.
 * Loaded at runtime via <link> in layout — only the active theme CSS is fetched.
 *
 * Usage: node scripts/build-theme-css.mjs [--watch]
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'url'

import postcss from 'postcss'
import tailwindcss from '@tailwindcss/postcss'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const outDir = path.join(rootDir, 'public/theme-assets')

const THEMES = ['blog', 'cms', 'kb']

async function buildTheme(themeId) {
  const from = path.join(rootDir, 'src/themes', themeId, 'tailwind.css')
  const source = fs.readFileSync(from, 'utf8')
  const result = await postcss([tailwindcss]).process(source, {
    from,
    to: path.join(outDir, `${themeId}.css`),
  })

  const outPath = path.join(outDir, `${themeId}.css`)
  fs.writeFileSync(outPath, result.css)
  console.log(`theme-assets/${themeId}.css (${result.css.length} bytes)`)
}

async function buildAll() {
  fs.mkdirSync(outDir, { recursive: true })
  for (const themeId of THEMES) {
    await buildTheme(themeId)
  }
}

function watchThemes() {
  for (const themeId of THEMES) {
    const themeDir = path.join(rootDir, 'src/themes', themeId)
    fs.watch(themeDir, { recursive: true }, (_event, filename) => {
      if (!filename || (!filename.endsWith('.css') && !filename.endsWith('.tsx'))) return
      buildTheme(themeId).catch((error) => {
        console.error(`Failed to rebuild ${themeId} theme CSS:`, error)
      })
    })
  }

  console.log('Watching src/themes/{blog,cms,kb} for CSS/TSX changes…')
}

const watch = process.argv.includes('--watch')

await buildAll()

if (watch) {
  watchThemes()
}
