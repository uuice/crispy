import { Routes } from '@angular/router'

export const JOB_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./job.page').then((m) => m.JobPage),
    data: { keepAlive: true }
  }
]
