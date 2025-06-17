import { Routes } from '@angular/router'

export const CONFIGURATION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./configuration.page').then((m) => m.ConfigurationPage),
    data: { keepAlive: true }
  }
]
