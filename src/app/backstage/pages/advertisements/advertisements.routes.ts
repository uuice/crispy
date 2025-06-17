import { Routes } from '@angular/router'

export const ADVERTISEMENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./advertisements.page').then((m) => m.AdvertisementsPage),
    data: { keepAlive: true }
  }
]
