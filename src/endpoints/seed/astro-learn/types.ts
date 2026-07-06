export type MigratedAuthor = {
  title: string
  slug: string
  excerpt?: string
  body: string
  published: boolean
}

export type MigratedPost = {
  id: string
  title: string
  slug: string
  alias?: string
  excerpt?: string
  categories: string[]
  tags: string[]
  body: string
  published: boolean
  publishedAt?: string
  updatedAt?: string
  sourcePath: string
}

export type MigratedPage = {
  id: string
  title: string
  slug: string
  alias?: string
  excerpt?: string
  tags: string[]
  body: string
  published: boolean
  publishedAt?: string
  updatedAt?: string
  sourcePath: string
}

export type MigratedLink = {
  title: string
  url: string
  description?: string
}

export type MigratedComment = {
  legacyId: string
  postSlug: string
  parentLegacyId?: string
  author: string
  email?: string
  content: string
  status: 'pending' | 'approved' | 'rejected' | 'spam'
  createdAt?: string
}

export type MigratedRecordSettings = {
  icpNumber?: string
  icpLink?: string
  policeNumber?: string
  policeLink?: string
  recordText?: string
  showRecord: boolean
}

export type MigratedSiteSetting = {
  siteName: string
  siteDescription?: string
  siteKeywords?: string
  baseUrl?: string
  recordSettings: MigratedRecordSettings
}

export type MigratedManifest = {
  version: 1
  importedAt: string
  sourceRoot: string
  author: MigratedAuthor
  posts: MigratedPost[]
  pages: MigratedPage[]
  categories: string[]
  tags: string[]
  links: MigratedLink[]
  comments: MigratedComment[]
  siteSetting: MigratedSiteSetting
}
