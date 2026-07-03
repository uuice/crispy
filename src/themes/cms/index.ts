import type { FrontendTheme } from '../types'
import { getFrontendThemeDefinition } from '../definitions'

import { loadCmsLayoutData } from './data/queries'
import { InitTheme } from './InitTheme'
import { Layout } from './Layout'
import { cmsPages } from './pages'
import { loadCmsSearchIndex } from './searchIndex'

import './styles.css'

const cmsDefinition = getFrontendThemeDefinition('cms')

export const cmsTheme: FrontendTheme = {
  id: 'cms',
  label: cmsDefinition.label,
  bodyClassName: 'cms-skin',
  Layout,
  InitTheme,
  pages: cmsPages,
  loadLayoutData: loadCmsLayoutData,
  loadSearchIndex: loadCmsSearchIndex,
}

export { Layout, InitTheme, cmsPages }
