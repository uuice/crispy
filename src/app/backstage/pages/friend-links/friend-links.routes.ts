import { Routes } from '@angular/router'

export const FRIEND_LINKS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./friend-links.page').then((m) => m.FriendLinksPage),
    data: { keepAlive: true }
  }
]
