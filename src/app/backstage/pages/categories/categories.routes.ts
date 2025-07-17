import { Routes } from '@angular/router'

export const CATEGORIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./categories.page').then((m) => m.CategoriesPage),
    data: { keepAlive: true }
  },
  {
    path: ':alias',
    loadComponent: () => import('./categories.page').then((m) => m.CategoriesPage),
    data: { keepAlive: true }
  }
]
