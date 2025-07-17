import { Routes } from '@angular/router'

export const MENUS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./menus.page').then((m) => m.MenusPage),
    data: { keepAlive: true }
  }
]
