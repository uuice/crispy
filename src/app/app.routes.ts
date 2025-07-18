import { Routes } from '@angular/router'
import { HomeLayoutComponent } from './web-pc/layouts/home-layout/home-layout.component'

export const routes: Routes = [
  {
    path: '',
    component: HomeLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./web-pc/pages/home.page').then((m) => m.HomePage)
      }
    ]
  },
  {
    path: '',
    component: HomeLayoutComponent,
    children: [
      {
        path: 'about',
        loadComponent: () => import('./web-pc/pages/about.page').then((m) => m.AboutPage)
      },
      {
        path: 'migration',
        loadComponent: () => import('./web-pc/pages/migration.page').then((m) => m.MigrationPage)
      },
      {
        path: 'api-docs',
        loadComponent: () => import('./web-pc/pages/api-docs.page').then((m) => m.ApiDocsPage)
      },
      {
        path: 'templates',
        loadComponent: () => import('./web-pc/pages/templates.page').then((m) => m.TemplatesPage)
      },
      {
        path: 'data-models',
        loadComponent: () => import('./web-pc/pages/data-models.page').then((m) => m.DataModelsPage)
      },
      {
        path: 'daily-lib',
        loadComponent: () => import('./web-pc/pages/daily-lib.page').then((m) => m.DailyLibPage)
      },
      {
        path: 'daily-lib/:url',
        loadComponent: () =>
          import('./web-pc/pages/daily-lib-detail.page').then((m) => m.DailyLibDetailPage)
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
