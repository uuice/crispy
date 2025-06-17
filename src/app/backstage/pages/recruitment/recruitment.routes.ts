import { Routes } from '@angular/router'

export const RECRUITMENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./recruitment.page').then((m) => m.RecruitmentPage),
    data: { keepAlive: true }
  }
]
