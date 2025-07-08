import { RenderMode, ServerRoute } from '@angular/ssr'

export const serverRoutes: ServerRoute[] = [
  // Home page needs SEO, enable SSR
  {
    path: '',
    renderMode: RenderMode.Server
  },
  // About page needs SEO, enable SSR
  {
    path: 'about',
    renderMode: RenderMode.Server
  },
  // Archives page needs SEO, enable SSR
  {
    path: 'archives',
    renderMode: RenderMode.Server
  },
  // Links page needs SEO, enable SSR
  {
    path: 'links',
    renderMode: RenderMode.Server
  },
  // Disclaimer page needs SEO, enable SSR
  {
    path: 'disclaimer',
    renderMode: RenderMode.Server
  },
  // Categories page needs SEO, enable SSR
  {
    path: 'categories',
    renderMode: RenderMode.Server
  },
  // Tags page needs SEO, enable SSR
  {
    path: 'tags',
    renderMode: RenderMode.Server
  },
  // Author page needs SEO, enable SSR
  {
    path: 'author',
    renderMode: RenderMode.Server
  },
  // Feed routes (RSS and Sitemap) use client-side rendering
  {
    path: 'rss',
    renderMode: RenderMode.Client
  },
  {
    path: 'sitemap.xml',
    renderMode: RenderMode.Client
  },
  // Other dynamic routes use client-side rendering
  {
    path: '**',
    renderMode: RenderMode.Client
  }
]
