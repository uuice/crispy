import type { ComponentType, ReactNode } from 'react'

import { pages } from './pages'
import type {
  FrontendPageDefinition,
  FrontendPageName,
  ListPageProps,
  SlugPageProps,
} from './types'

export type PageRouteProps = SlugPageProps | ListPageProps

export async function renderPage(name: FrontendPageName, props?: PageRouteProps): Promise<ReactNode> {
  const page: FrontendPageDefinition = pages[name]

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

  if (page.params === 'slug') {
    return (page.metadata as (input: SlugPageProps) => Promise<unknown>)(props as SlugPageProps)
  }

  return (page.metadata as (input?: ListPageProps) => Promise<unknown>)(
    props as ListPageProps | undefined,
  )
}
