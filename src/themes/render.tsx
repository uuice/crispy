import type { ReactNode } from 'react'

import { getActiveFrontendTheme } from './registry'
import type { SlugPageProps, ThemeListPageProps, ThemePageName } from './types'

export type ThemeRouteProps = SlugPageProps | ThemeListPageProps

export async function renderThemePage(
  name: ThemePageName,
  props?: ThemeRouteProps,
): Promise<ReactNode> {
  const theme = await getActiveFrontendTheme()
  const page = theme.pages[name]

  if (page.params === 'slug') {
    const data = await (page.load as (input: SlugPageProps) => Promise<unknown>)(
      props as SlugPageProps,
    )
    const View = page.View as React.ComponentType<{ data: unknown }>
    return <View data={data} />
  }

  const data = await (page.load as (input?: ThemeListPageProps) => Promise<unknown>)(
    props as ThemeListPageProps | undefined,
  )
  const View = page.View as React.ComponentType<{ data: unknown }>
  return <View data={data} />
}

export async function generateThemeMetadata(name: ThemePageName, props?: ThemeRouteProps) {
  const theme = await getActiveFrontendTheme()
  const page = theme.pages[name]
  if (!page.metadata) return {}

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
