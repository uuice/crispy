import type { ReactNode } from 'react'

import { getActiveFrontendTheme } from './registry'
import type { SlugPageProps, ThemePageName } from './types'

export async function renderThemePage(name: ThemePageName, props?: SlugPageProps): Promise<ReactNode> {
  const theme = await getActiveFrontendTheme()
  const page = theme.pages[name]

  if (page.params === 'slug') {
    const data = await (page.load as (input: SlugPageProps) => Promise<unknown>)(props as SlugPageProps)
    const View = page.View as React.ComponentType<{ data: unknown }>
    return <View data={data} />
  }

  const data = await (page.load as () => Promise<unknown>)()
  const View = page.View as React.ComponentType<{ data: unknown }>
  return <View data={data} />
}

export async function generateThemeMetadata(name: ThemePageName, props?: SlugPageProps) {
  const theme = await getActiveFrontendTheme()
  const page = theme.pages[name]
  if (!page.metadata) return {}

  if (page.params === 'slug') {
    return (page.metadata as (input: SlugPageProps) => Promise<unknown>)(props as SlugPageProps)
  }

  return (page.metadata as () => Promise<unknown>)()
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
