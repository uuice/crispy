import { Routes } from '@angular/router'

export const CACHES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./caches.page').then((m) => m.CachePage),
    data: { keepAlive: true }
  }
]
