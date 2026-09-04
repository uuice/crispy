import type { Metadata } from 'next'
import type React from 'react'

export type SearchParams = Record<string, string | string[] | undefined>

export type SlugPageProps = {
  params: Promise<{ slug: string }>
  searchParams?: Promise<SearchParams>
}

export type ListPageProps = {
  searchParams?: Promise<SearchParams>
}

export type FrontendPageName =
  | 'home'
  | 'posts'
  | 'postDetail'
  | 'pageDetail'
  | 'categoryDetail'
  | 'tagDetail'
  | 'userDetail'
  | 'links'
  | 'galleries'
  | 'galleryDetail'
  | 'navigations'
  | 'notFound'
  | 'serverError'

export type FrontendPageDefinition = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  load: (...args: any[]) => Promise<unknown>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  View: React.ComponentType<{ data: any }>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: (...args: any[]) => Promise<Metadata> | Metadata
  staticParams?: () => Promise<Array<Record<string, string>>>
  /** When set, load/metadata receive SlugPageProps from the app route. */
  params?: 'slug'
}

export type FrontendPages = Record<FrontendPageName, FrontendPageDefinition>

export type SearchIndexItem = {
  id: string
  title: string
  url: string
  excerpt?: string
  categories?: string[]
  tags?: string[]
  body?: string
}
