import { Routes } from '@angular/router'

export const PAGES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages.page').then((m) => m.PagesPage),
    data: { keepAlive: true }
  },
  {
    path: 'create',
    loadComponent: () => import('./create/create.page').then((m) => m.CreatePagePage),
    data: { keepAlive: true }
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./edit/edit.page').then((m) => m.EditPagePage),
    data: { keepAlive: true }
  }
]
