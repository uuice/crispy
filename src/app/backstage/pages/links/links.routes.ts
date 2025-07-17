import { Routes } from '@angular/router'

export const LINKS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./link.page').then((m) => m.LinksPage),
    data: { keepAlive: true }
  }
]
