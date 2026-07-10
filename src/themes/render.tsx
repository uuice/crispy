import type { ComponentType, ReactNode } from 'react'

import { getActiveFrontendTheme } from './registry'
import type { NovelChapterPageProps, SlugPageProps, ThemeListPageProps, ThemePageName } from './types'

export type ThemeRouteProps = SlugPageProps | ThemeListPageProps | NovelChapterPageProps

export async function renderThemePage(
  name: ThemePageName,
  props?: ThemeRouteProps,
): Promise<ReactNode> {
  const theme = await getActiveFrontendTheme()
  const page = theme.pages[name]

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

  const data = await (page.load as (input?: ThemeListPageProps) => Promise<unknown>)(
    props as ThemeListPageProps | undefined,
  )
  const View = page.View as ComponentType<{ data: unknown }>
  return <View data={data} />
}

export async function generateThemeMetadata(name: ThemePageName, props?: ThemeRouteProps) {
  const theme = await getActiveFrontendTheme()
  const page = theme.pages[name]
  if (!page.metadata) return {}

  if (page.params === 'novelChapter') {
    return (page.metadata as (input: NovelChapterPageProps) => Promise<unknown>)(
      props as NovelChapterPageProps,
    )
  }

  if (page.params === 'slug') {
    return (page.metadata as (input: SlugPageProps) => Promise<unknown>)(props as SlugPageProps)
  }

  return (page.metadata as (input?: ThemeListPageProps) => Promise<unknown>)(
    props as ThemeListPageProps | undefined,
  )
}

export async function generateThemeStaticParams(name: ThemePageName) {
  const theme = await getActiveFrontendTheme()
  const page = theme.pages[name]
  if (!page.staticParams) return []
  return page.staticParams()
}

export async function loadThemeSearchIndex() {
  const theme = await getActiveFrontendTheme()
  if (!theme.loadSearchIndex) return []
  return theme.loadSearchIndex()
}
