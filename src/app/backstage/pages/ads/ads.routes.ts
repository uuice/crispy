import { Routes } from '@angular/router'

export const ADS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./ad.page').then((m) => m.AdvertisementsPage),
    data: { keepAlive: true }
  },
  {
    path: 'item-list',
    loadComponent: () => import('./ad-items.page').then((m) => m.AdItemsPage),
    data: { keepAlive: true }
  }
]
