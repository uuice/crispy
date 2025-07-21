import { Routes } from '@angular/router'
import { DocLayoutComponent } from './web-pc/layouts/doc-layout/doc-layout.component'
import { HomeLayoutComponent } from './web-pc/layouts/home-layout/home-layout.component'

export const routes: Routes = [
  {
    path: '',
    component: HomeLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./web-pc/pages/home.page').then((m) => m.HomePage)
      },
      {
        path: 'archives',
        loadComponent: () => import('./web-pc/pages/archives.page').then((m) => m.ArchivesPage)
      },
      {
        path: 'archives/:url',
        loadComponent: () => import('./web-pc/pages/archives.page').then((m) => m.ArchivesPage)
      },
      {
        path: 'links',
        loadComponent: () => import('./web-pc/pages/links.page').then((m) => m.LinksPage)
      },
      {
        path: 'daily-lib',
        loadComponent: () => import('./web-pc/pages/daily-lib.page').then((m) => m.DailyLibPage)
      },
      {
        path: 'daily-lib/:url',
        loadComponent: () =>
          import('./web-pc/pages/daily-lib-detail.page').then((m) => m.DailyLibDetailPage)
      },

      {
        path: 'categories/:url',
        loadComponent: () => import('./web-pc/pages/categories.page').then((m) => m.CategoriesPage)
      },
      {
        path: 'tags/:url',
        loadComponent: () => import('./web-pc/pages/tags.page').then((m) => m.TagsPage)
      },
      {
        path: 'pages/:url',
        loadComponent: () => import('./web-pc/pages/pages.page').then((m) => m.PagesPage)
      },
      {
        path: 'about',
        loadComponent: () => import('./web-pc/pages/about.page').then((m) => m.AboutPage)
      }
    ]
  },

  {
    path: 'doc',
    component: DocLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./web-pc/pages/doc/home.page').then((m) => m.DocHomePage)
      },
      {
        path: 'about',
        loadComponent: () => import('./web-pc/pages/doc/about.page').then((m) => m.DocAboutPage)
      },
      {
        path: 'migration',
        loadComponent: () =>
          import('./web-pc/pages/doc/migration.page').then((m) => m.DocMigrationPage)
      },
      {
        path: 'api-docs',
        loadComponent: () =>
          import('./web-pc/pages/doc/api-docs.page').then((m) => m.DocApiDocsPage)
      },
      {
        path: 'templates',
        loadComponent: () =>
          import('./web-pc/pages/doc/templates.page').then((m) => m.DocTemplatesPage)
      },
      {
        path: 'data-models',
        loadComponent: () =>
          import('./web-pc/pages/doc/data-models.page').then((m) => m.DocDataModelsPage)
      }
    ]
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
