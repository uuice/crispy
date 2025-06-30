import { Routes } from '@angular/router'

export const PAGES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages.page').then((m) => m.PagesPage),
    data: { keepAlive: true }
  }
]
