import { Routes } from '@angular/router'
import { HomeLayoutComponent } from './web-pc/layouts/home-layout/home-layout.component'
import { MainLayoutComponent } from './web-pc/layouts/main-layout/main-layout.component'

export const routes: Routes = [
  {
    path: '',
    component: HomeLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./web-pc/pages/home/home.page').then((m) => m.HomePage)
      }
    ]
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'about',
        loadComponent: () => import('./web-pc/pages/about/about.page').then((m) => m.AboutPage)
      },
      {
        path: 'archives',
        loadComponent: () =>
          import('./web-pc/pages/archives/archives.page').then((m) => m.ArchivesPage)
      },
      {
        path: 'links',
        loadComponent: () => import('./web-pc/pages/links/links.page').then((m) => m.LinksPage)
      },
      {
        path: 'disclaimer',
        loadComponent: () =>
          import('./web-pc/pages/disclaimer/disclaimer.page').then((m) => m.DisclaimerPage)
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./web-pc/pages/categories/categories.page').then((m) => m.CategoriesPage)
      },
      {
        path: 'tags',
        loadComponent: () => import('./web-pc/pages/tags/tags.page').then((m) => m.TagsPage)
      },
      {
        path: 'author',
        loadComponent: () => import('./web-pc/pages/author/author.page').then((m) => m.AuthorPage)
      }
    ]
  },
  // Feed routes (RSS and Sitemap)
  {
    path: 'rss',
    loadComponent: () => import('./web-pc/pages/feed/feed.component').then((m) => m.FeedComponent)
  },
  {
    path: 'sitemap.xml',
    loadComponent: () => import('./web-pc/pages/feed/feed.component').then((m) => m.FeedComponent)
  },
  // Backstage routes (client-side rendering)
  {
    path: 'backstage',
    loadChildren: () => import('./backstage/backstage.routes').then((m) => m.BACKSTAGE_ROUTES)
  },
  {
    path: '**',
    redirectTo: ''
  }
]
