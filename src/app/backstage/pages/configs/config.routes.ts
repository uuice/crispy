import { Routes } from '@angular/router'

export const CONFIG_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./config.page').then((m) => m.ConfigPage),
    data: { keepAlive: true }
  }
]
