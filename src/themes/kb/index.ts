import type { FrontendTheme } from '../types'
import { getFrontendThemeDefinition } from '../definitions'

import { loadKbLayoutData } from './data/queries'
import { InitTheme } from './InitTheme'
import { Layout } from './Layout'
import { kbPages } from './pages'
import { loadKbSearchIndex } from './searchIndex'

import './styles.css'

const kbDefinition = getFrontendThemeDefinition('kb')

export const kbTheme: FrontendTheme = {
  id: 'kb',
  label: kbDefinition.label,
  rootClassName: 'kb-skin',
  bodyClassName: 'kb-skin',
  Layout,
  InitTheme,
  pages: kbPages,
  loadLayoutData: loadKbLayoutData,
  loadSearchIndex: loadKbSearchIndex,
}

export { Layout, InitTheme, kbPages }
