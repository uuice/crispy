import { Routes } from '@angular/router'

export const ATTRS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./attr.page').then((m) => m.AttrsPage),
    data: { keepAlive: true }
  }
]
