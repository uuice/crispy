import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./backstage.routes').then((m) => m.BACKSTAGE_ROUTES)
  }
]
