import { RenderMode, ServerRoute } from '@angular/ssr'

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Server
  },
  {
    path: 'archives',
    renderMode: RenderMode.Server
  },
  {
    path: 'archives/:url',
    renderMode: RenderMode.Server
  },
  {
    path: 'links',
    renderMode: RenderMode.Server
  },
  {
    path: 'daily-lib',
    renderMode: RenderMode.Server
  },
  {
    path: 'daily-lib/:url',
    renderMode: RenderMode.Server
  },
  {
    path: 'categories/:alias',
    renderMode: RenderMode.Server
  },
  {
    path: 'tags/:value',
    renderMode: RenderMode.Server
  },
  {
    path: 'pages/:url',
    renderMode: RenderMode.Server
  },
  {
    path: 'about',
    renderMode: RenderMode.Server
  },

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
