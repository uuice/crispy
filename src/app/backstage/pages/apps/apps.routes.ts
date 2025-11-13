import { Routes } from '@angular/router'

export const APPS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./apps.page').then((m) => m.AppsPage),
    data: { keepAlive: true }
  }
]
