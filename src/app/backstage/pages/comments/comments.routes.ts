import { Routes } from '@angular/router'

export const COMMENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./comments.page').then((m) => m.CommentsPage)
  }
]
