import { RenderMode, ServerRoute } from '@angular/ssr'

export const serverRoutes: ServerRoute[] = [
  {
    path: 'doc',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'doc/about',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'doc/migration',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'doc/api-docs',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'doc/templates',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'doc/data-models',
    renderMode: RenderMode.Prerender
  },

  {
    path: '**',
    renderMode: RenderMode.Client
  }
]
