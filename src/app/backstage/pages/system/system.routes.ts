import { Routes } from '@angular/router'

export const SYSTEM_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./system.page').then((m) => m.SystemPage),
    data: { keepAlive: true }
  }
]
