import type { RequiredDataFromCollectionSlug } from 'payload'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { markdownToLexical } from './astro-learn/markdownToLexical'

const seedDir = path.dirname(fileURLToPath(import.meta.url))

function loadAboutPageBody(): string {
  return fs.readFileSync(path.join(seedDir, 'about-content.md'), 'utf-8')
}

export const about: () => RequiredDataFromCollectionSlug<'pages'> = () => {
  return {
    slug: 'about',
    _status: 'published',
    hero: {
      type: 'none',
    },
    layout: [
      {
        blockType: 'content',
        columns: [
          {
            size: 'full',
            richText: markdownToLexical(loadAboutPageBody()),
          },
        ],
      },
    ],
    title: '关于',
    meta: {
      description: 'Crispy 3.0 技术架构、内容与功能说明',
    },
  }
}
