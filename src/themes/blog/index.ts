import type { FrontendTheme } from '../types'
import { getFrontendThemeDefinition } from '../definitions'

import { querySidebarData } from './data/queries'
import { InitTheme } from './InitTheme'
import { Layout } from './Layout'
import { blogPages } from './pages'
import { loadBlogSearchIndex } from './searchIndex'

import './styles.css'

const blogDefinition = getFrontendThemeDefinition('blog')

export const blogTheme: FrontendTheme = {
  id: 'blog',
  label: blogDefinition.label,
  bodyClassName: 'blog-skin',
  Layout,
  InitTheme,
  pages: blogPages,
  loadLayoutData: querySidebarData,
  loadSearchIndex: loadBlogSearchIndex,
}

export { Layout, InitTheme, blogPages }
