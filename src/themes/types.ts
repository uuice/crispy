import type { Metadata } from 'next'
import type React from 'react'

import type { FrontendThemeId } from './definitions'

export type { FrontendThemeId } from './definitions'

export type ThemeSearchParams = Record<string, string | string[] | undefined>

export type SlugPageProps = {
  params: Promise<{ slug: string }>
  searchParams?: Promise<ThemeSearchParams>
}

export type ThemeListPageProps = {
  searchParams?: Promise<ThemeSearchParams>
}

export type ThemePageName =
  | 'home'
  | 'posts'
  | 'postDetail'
  | 'pageDetail'
  | 'categoryDetail'
  | 'tagDetail'
  | 'userDetail'
  | 'links'
  | 'galleryItems'
  | 'jobs'
  | 'navigations'
  | 'games'
  | 'gamesMath'
  | 'notFound'
  | 'serverError'

export type ThemePageDefinition = {
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

export type FrontendThemePages = Record<ThemePageName, ThemePageDefinition>

export type ThemeSearchIndexItem = {
  id: string
  title: string
  url: string
  excerpt?: string
  categories?: string[]
  tags?: string[]
  body?: string
}

export type FrontendThemeLayoutProps = {
  children: React.ReactNode
  layoutData?: unknown
}

export type FrontendTheme = {
  id: FrontendThemeId
  label: string
  /** Root class on `<html>` — scopes all theme CSS (e.g. blog-skin). */
  rootClassName: string
  /** @deprecated Use rootClassName — kept for compatibility. */
  bodyClassName: string
  Layout: React.ComponentType<FrontendThemeLayoutProps>
  InitTheme?: React.ComponentType
  pages: FrontendThemePages
  loadLayoutData?: () => Promise<unknown>
  loadSearchIndex?: () => Promise<ThemeSearchIndexItem[]>
}
