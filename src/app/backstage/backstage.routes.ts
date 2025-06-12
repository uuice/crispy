import { Routes } from '@angular/router'
import { BackstageLayoutComponent } from './layout/layout.component'

export const BACKSTAGE_ROUTES: Routes = [
  {
    path: '',
    component: BackstageLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage)
      },
      {
        path: 'posts',
        loadChildren: () => import('./pages/posts/posts.routes').then((m) => m.POSTS_ROUTES)
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('./pages/categories/categories.routes').then((m) => m.CATEGORIES_ROUTES)
      },
      {
        path: 'tags',
        loadChildren: () => import('./pages/tags/tags.routes').then((m) => m.TAGS_ROUTES)
      },
      {
        path: 'comments',
        loadChildren: () =>
          import('./pages/comments/comments.routes').then((m) => m.COMMENTS_ROUTES)
      },
      {
        path: 'users',
        loadChildren: () => import('./pages/users/users.routes').then((m) => m.USERS_ROUTES)
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./pages/settings/settings.routes').then((m) => m.SETTINGS_ROUTES)
      },
      {
        path: 'friend-links',
        loadChildren: () =>
          import('./pages/friend-links/friend-links.routes').then((m) => m.FRIEND_LINKS_ROUTES)
      },
      {
        path: 'recruitment',
        loadChildren: () =>
          import('./pages/recruitment/recruitment.routes').then((m) => m.RECRUITMENT_ROUTES)
      },
      {
        path: 'configuration',
        loadChildren: () =>
          import('./pages/configuration/configuration.routes').then((m) => m.CONFIGURATION_ROUTES)
      },
      {
        path: 'system',
        loadChildren: () => import('./pages/system/system.routes').then((m) => m.SYSTEM_ROUTES)
      },
      {
        path: 'vacation',
        loadChildren: () =>
          import('./pages/vacation/vacation.routes').then((m) => m.VACATION_ROUTES)
      },
      {
        path: 'special-tags',
        loadChildren: () =>
          import('./pages/special-tags/special-tags.routes').then((m) => m.SPECIAL_TAGS_ROUTES)
      }
    ]
  }
]
