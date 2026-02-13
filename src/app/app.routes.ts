import { Routes } from '@angular/router'
import { DocLayoutComponent } from './web-pc/layouts/doc-layout/doc-layout.component'

export const routes: Routes = [
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
