import { Routes } from '@angular/router'

export const HOLIDAYS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./holiday.page').then((m) => m.HolidayPage),
    data: { keepAlive: true }
  }
]
