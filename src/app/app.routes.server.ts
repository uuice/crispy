import { RenderMode, ServerRoute } from '@angular/ssr'

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'about',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'migration',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'api-docs',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'templates',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'data-models',
    renderMode: RenderMode.Prerender
  },
  {
    path: '**',
    renderMode: RenderMode.Client
  }
]
