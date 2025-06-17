import { Routes } from '@angular/router'

export const SPECIAL_TAGS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./special-tags.page').then((m) => m.SpecialTagsPage),
    data: { keepAlive: true }
  }
]
