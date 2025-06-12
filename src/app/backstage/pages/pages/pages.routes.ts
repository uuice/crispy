import { Routes } from '@angular/router'

export const PAGES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages.page').then((m) => m.PagesPage)
  },
  {
    path: 'create',
    loadComponent: () => import('./create/create.page').then((m) => m.CreatePagePage)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./edit/edit.page').then((m) => m.EditPagePage)
  }
]
