import type { ComponentType, ReactNode } from 'react'

import { pages } from './pages'
import type {
  FrontendPageDefinition,
  FrontendPageName,
  ListPageProps,
  NovelChapterPageProps,
  SlugPageProps,
} from './types'

export type PageRouteProps = SlugPageProps | ListPageProps | NovelChapterPageProps

export async function renderPage(name: FrontendPageName, props?: PageRouteProps): Promise<ReactNode> {
  const page: FrontendPageDefinition = pages[name]

  if (page.params === 'novelChapter') {
    const data = await (page.load as (input: NovelChapterPageProps) => Promise<unknown>)(
      props as NovelChapterPageProps,
    )
    const View = page.View as ComponentType<{ data: unknown }>
    return <View data={data} />
  }

  if (page.params === 'slug') {
    const data = await (page.load as (input: SlugPageProps) => Promise<unknown>)(
      props as SlugPageProps,
    )
    const View = page.View as ComponentType<{ data: unknown }>
    return <View data={data} />
  }

  const data = await (page.load as (input?: ListPageProps) => Promise<unknown>)(
    props as ListPageProps | undefined,
  )
  const View = page.View as ComponentType<{ data: unknown }>
  return <View data={data} />
}

export async function generatePageMetadata(name: FrontendPageName, props?: PageRouteProps) {
  const page: FrontendPageDefinition = pages[name]
  if (!page.metadata) return {}

  if (page.params === 'novelChapter') {
    return (page.metadata as (input: NovelChapterPageProps) => Promise<unknown>)(
      props as NovelChapterPageProps,
    )
  }

  if (page.params === 'slug') {
    return (page.metadata as (input: SlugPageProps) => Promise<unknown>)(props as SlugPageProps)
  }

  return (page.metadata as (input?: ListPageProps) => Promise<unknown>)(
    props as ListPageProps | undefined,
  )
}
