import { Routes } from '@angular/router'

export const OPERATE_LOGS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./operate-logs.page').then((m) => m.OperateLogsPage),
    data: { keepAlive: true }
  }
]
