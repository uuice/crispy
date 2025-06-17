import { Routes } from '@angular/router'

export const POSTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./posts.page').then((m) => m.PostsPage),
    data: { keepAlive: true }
  },
  {
    path: 'create',
    loadComponent: () => import('./create/create.page').then((m) => m.CreatePostPage),
    data: { keepAlive: true }
  }
]
