import { Routes } from '@angular/router'

export const POSTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./posts.page').then((m) => m.PostsPage),
    data: { keepAlive: true }
  },
  {
    path: 'post-sys-cat/categories',
    redirectTo: '/backstage/categories/post-sys-cat',
    pathMatch: 'full'
  }
]
