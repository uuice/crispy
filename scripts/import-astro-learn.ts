#!/usr/bin/env tsx
import path from 'path'
import { fileURLToPath } from 'url'

import {
  importAstroLearnContent,
  writeMigratedManifest,
} from '../src/endpoints/seed/astro-learn/importContent'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const defaultSource = path.resolve(ROOT, '../astro-learn')
const sourceRoot = process.env.ASTRO_LEARN_PATH?.trim() || defaultSource
const outputDir = path.join(ROOT, 'src/endpoints/seed/migrated-content')

const manifest = importAstroLearnContent(sourceRoot)
writeMigratedManifest(manifest, outputDir)

console.log(`Imported astro-learn content from: ${sourceRoot}`)
console.log(`  posts: ${manifest.posts.length}`)
console.log(`  pages: ${manifest.pages.length}`)
console.log(`  categories: ${manifest.categories.length}`)
console.log(`  tags: ${manifest.tags.length}`)
console.log(`  links: ${manifest.links.length}`)
console.log(`  comments: ${manifest.comments.length}`)
console.log(`Wrote manifest to: ${outputDir}/manifest.json`)
