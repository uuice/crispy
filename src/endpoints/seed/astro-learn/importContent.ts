import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { slugifyFromTitle } from '@/utilities/slugifyTitle'

import {
  asBoolean,
  asString,
  asStringArray,
  parseDate,
  parseMarkdownFile,
} from './parseFrontmatter'
import { resolveSlug } from './titleToUrl'
import type {
  MigratedAuthor,
  MigratedComment,
  MigratedLink,
  MigratedManifest,
  MigratedPage,
  MigratedPost,
  MigratedSiteSetting,
} from './types'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** Demo posts that rely on MDX components or custom Markdown directives — skip migration. */
const EXCLUDED_POST_SLUGS = new Set(['animation-timeline-demo', 'markdown-extensions-demo'])

function readJsonFile<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T
}

function walkMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return []

  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...walkMarkdownFiles(fullPath))
      continue
    }
    if (/\.md$/i.test(entry.name)) {
      files.push(fullPath)
    }
  }

  return files.sort()
}

function collectUnique(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, 'zh-CN'),
  )
}

function slugifyTag(tag: string): string {
  return slugifyFromTitle(tag) || 'tag'
}

function parsePostFile(filePath: string, sourceRoot: string): MigratedPost {
  const raw = fs.readFileSync(filePath, 'utf8')
  const { frontmatter, body } = parseMarkdownFile(raw)
  const title = asString(frontmatter.title) ?? path.basename(filePath, path.extname(filePath))
  const alias = asString(frontmatter.alias)

  return {
    id: asString(frontmatter.id) ?? title,
    title,
    slug: resolveSlug(title, alias),
    alias,
    excerpt: asString(frontmatter.excerpt),
    categories: asStringArray(frontmatter.categories),
    tags: asStringArray(frontmatter.tags),
    body,
    published: asBoolean(frontmatter.published, true),
    publishedAt: parseDate(frontmatter.created_time),
    updatedAt: parseDate(frontmatter.updated_time),
    sourcePath: path.relative(sourceRoot, filePath),
  }
}

function parsePageFile(filePath: string, sourceRoot: string): MigratedPage {
  const raw = fs.readFileSync(filePath, 'utf8')
  const { frontmatter, body } = parseMarkdownFile(raw)
  const title = asString(frontmatter.title) ?? path.basename(filePath, path.extname(filePath))
  const alias = asString(frontmatter.alias)

  return {
    id: asString(frontmatter.id) ?? title,
    title,
    slug: resolveSlug(title, alias),
    alias,
    excerpt: asString(frontmatter.excerpt),
    tags: asStringArray(frontmatter.tags),
    body,
    published: asBoolean(frontmatter.published, true),
    publishedAt: parseDate(frontmatter.created_time),
    updatedAt: parseDate(frontmatter.updated_time),
    sourcePath: path.relative(sourceRoot, filePath),
  }
}

function parseAuthorFile(filePath: string): MigratedAuthor {
  const raw = fs.readFileSync(filePath, 'utf8')
  const { frontmatter, body } = parseMarkdownFile(raw)
  const title = asString(frontmatter.title) ?? 'uuice'

  return {
    title,
    slug: resolveSlug(title, asString(frontmatter.alias)),
    excerpt: asString(frontmatter.excerpt),
    body,
    published: asBoolean(frontmatter.published, true),
  }
}

function parseComments(sourceRoot: string, posts: MigratedPost[]): MigratedComment[] {
  const commentsPath = path.join(sourceRoot, 'data/comments.json')
  if (!fs.existsSync(commentsPath)) return []

  const payload = readJsonFile<{ comments?: Array<Record<string, unknown>> }>(commentsPath)
  const slugByArchivePath = new Map(
    posts.map((post) => [`/archives/${post.slug}`, post.slug] as const),
  )

  return (payload.comments ?? []).map((comment) => {
    const postPath = asString(comment.postId) ?? ''
    const postSlug = slugByArchivePath.get(postPath) ?? postPath.replace(/^\/archives\//, '')
    const status = asString(comment.status) === 'approved' ? 'approved' : 'pending'
    const createdAtMs = typeof comment.createdAt === 'number' ? comment.createdAt : undefined

    return {
      legacyId: asString(comment.id) ?? crypto.randomUUID(),
      postSlug,
      parentLegacyId: asString(comment.parentId),
      author: asString(comment.author) ?? 'Guest',
      email: asString(comment.email),
      content: asString(comment.content) ?? '',
      status,
      createdAt: createdAtMs ? new Date(createdAtMs).toISOString() : undefined,
    }
  })
}

function parseLinks(sourceRoot: string): MigratedLink[] {
  const linksPath = path.join(sourceRoot, 'src/content/json/link.json')
  if (!fs.existsSync(linksPath)) return []

  const items = readJsonFile<Array<{ title?: string; url?: string; type?: string }>>(linksPath)
  return items
    .filter((item) => item.title && item.url)
    .map((item) => ({
      title: item.title ?? '',
      url: item.url ?? '',
      description: item.type,
    }))
}

function parseSiteSetting(sourceRoot: string): MigratedSiteSetting {
  const settingPath = path.join(sourceRoot, 'src/content/json/setting.json')
  if (!fs.existsSync(settingPath)) {
    return {
      siteName: '轻盈的鱼',
      siteDescription: '专注于前端开发的程序员博客',
      recordSettings: { showRecord: true },
    }
  }

  const setting = readJsonFile<{
    siteSetting?: Record<string, unknown>
    recordSettings?: Record<string, unknown>
  }>(settingPath)
  const siteSetting = setting.siteSetting ?? {}
  const recordSettings = setting.recordSettings ?? {}

  return {
    siteName: asString(siteSetting.siteName) ?? '轻盈的鱼',
    siteDescription: asString(siteSetting.siteDescription),
    siteKeywords: asString(siteSetting.siteKeywords),
    baseUrl: asString(siteSetting.baseUrl),
    recordSettings: {
      icpNumber: asString(recordSettings.icpNumber),
      icpLink: asString(recordSettings.icpLink) ?? 'https://beian.miit.gov.cn/',
      policeNumber: asString(recordSettings.policeNumber),
      policeLink: asString(recordSettings.policeLink),
      recordText: asString(recordSettings.recordText),
      showRecord: asBoolean(recordSettings.showRecord, true),
    },
  }
}

export function importAstroLearnContent(sourceRoot: string): MigratedManifest {
  const blogDir = path.join(sourceRoot, 'src/content/blog')
  const pageDir = path.join(sourceRoot, 'src/content/page')
  const authorDir = path.join(sourceRoot, 'src/content/author')

  const posts = walkMarkdownFiles(blogDir)
    .map((filePath) => parsePostFile(filePath, sourceRoot))
    .filter((post) => !EXCLUDED_POST_SLUGS.has(post.slug))
  const pages = walkMarkdownFiles(pageDir).map((filePath) => parsePageFile(filePath, sourceRoot))

  const authorFiles = walkMarkdownFiles(authorDir)
  const author = authorFiles[0]
    ? parseAuthorFile(authorFiles[0])
    : {
        title: 'uuice',
        slug: 'uuice',
        excerpt: 'Vue · Angular · Node.js · 前端开发',
        body: '',
        published: true,
      }

  const categories = collectUnique(posts.flatMap((post) => post.categories))
  const tags = collectUnique([
    ...posts.flatMap((post) => post.tags),
    ...pages.flatMap((page) => page.tags),
  ])

  posts.sort((a, b) => {
    const aTime = a.publishedAt ? Date.parse(a.publishedAt) : 0
    const bTime = b.publishedAt ? Date.parse(b.publishedAt) : 0
    return bTime - aTime
  })

  return {
    version: 1,
    importedAt: new Date().toISOString(),
    sourceRoot,
    author,
    posts,
    pages,
    categories,
    tags,
    links: parseLinks(sourceRoot),
    comments: parseComments(sourceRoot, posts),
    siteSetting: parseSiteSetting(sourceRoot),
  }
}

export function writeMigratedManifest(manifest: MigratedManifest, outputDir: string): void {
  fs.mkdirSync(outputDir, { recursive: true })
  fs.writeFileSync(path.join(outputDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)
}

export function loadMigratedManifest(): MigratedManifest {
  const manifestPath = path.join(__dirname, '../migrated-content/manifest.json')
  if (!fs.existsSync(manifestPath)) {
    throw new Error(
      'Missing migrated-content/manifest.json. Run: pnpm cli seed:import-astro-learn',
    )
  }

  return readJsonFile<MigratedManifest>(manifestPath)
}

export { slugifyTag }
