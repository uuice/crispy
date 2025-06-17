import { Routes } from '@angular/router'

export const TAGS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./tags.page').then((m) => m.TagsPage),
    data: { keepAlive: true }
  }
]
