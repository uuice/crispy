import { Routes } from '@angular/router'
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component'
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component'

export const routes: Routes = [
  {
    path: '',
    component: HomeLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage)
      }
    ]
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'about',
        loadComponent: () => import('./pages/about/about.page').then((m) => m.AboutPage)
      },
      {
        path: 'archives',
        loadComponent: () => import('./pages/archives/archives.page').then((m) => m.ArchivesPage)
      },
      {
        path: 'links',
        loadComponent: () => import('./pages/links/links.page').then((m) => m.LinksPage)
      },
      {
        path: 'disclaimer',
        loadComponent: () =>
          import('./pages/disclaimer/disclaimer.page').then((m) => m.DisclaimerPage)
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./pages/categories/categories.page').then((m) => m.CategoriesPage)
      },
      {
        path: 'tags',
        loadComponent: () => import('./pages/tags/tags.page').then((m) => m.TagsPage)
      },
      {
        path: 'author',
        loadComponent: () => import('./pages/author/author.page').then((m) => m.AuthorPage)
      }
    ]
  },
  // Feed routes (RSS and Sitemap)
  {
    path: 'rss',
    loadComponent: () => import('./pages/feed/feed.component').then((m) => m.FeedComponent)
  },
  {
    path: 'sitemap.xml',
    loadComponent: () => import('./pages/feed/feed.component').then((m) => m.FeedComponent)
  },
  // Backstage routes (client-side rendering)
  {
    path: 'backstage',
    loadChildren: () => import('../backstage/backstage.routes').then((m) => m.BACKSTAGE_ROUTES)
  },
  {
    path: '**',
    redirectTo: ''
  }
]
