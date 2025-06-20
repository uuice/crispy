import { Routes } from '@angular/router'
import { BackstageLayoutComponent } from './layout/layout.component'
import { AuthGuard } from './guards/auth.guard'

export const BACKSTAGE_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage)
  },
  {
    path: '',
    component: BackstageLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage),
        data: { keepAlive: true }
      },
      {
        path: 'posts',
        loadChildren: () => import('./pages/posts/posts.routes').then((m) => m.POSTS_ROUTES),
        data: { keepAlive: true }
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('./pages/categories/categories.routes').then((m) => m.CATEGORIES_ROUTES),
        data: { keepAlive: true }
      },
      {
        path: 'tags',
        loadChildren: () => import('./pages/tags/tags.routes').then((m) => m.TAGS_ROUTES),
        data: { keepAlive: true }
      },
      {
        path: 'comments',
        loadChildren: () =>
          import('./pages/comments/comments.routes').then((m) => m.COMMENTS_ROUTES),
        data: { keepAlive: true }
      },
      {
        path: 'users',
        loadChildren: () => import('./pages/users/users.routes').then((m) => m.USERS_ROUTES),
        data: { keepAlive: true }
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./pages/settings/settings.routes').then((m) => m.SETTINGS_ROUTES),
        data: { keepAlive: true }
      },
      {
        path: 'friend-links',
        loadChildren: () =>
          import('./pages/friend-links/friend-links.routes').then((m) => m.FRIEND_LINKS_ROUTES),
        data: { keepAlive: true }
      },
      {
        path: 'recruitment',
        loadChildren: () =>
          import('./pages/recruitment/recruitment.routes').then((m) => m.RECRUITMENT_ROUTES),
        data: { keepAlive: true }
      },
      {
        path: 'configuration',
        loadChildren: () =>
          import('./pages/configuration/configuration.routes').then((m) => m.CONFIGURATION_ROUTES),
        data: { keepAlive: true }
      },
      {
        path: 'system',
        loadChildren: () => import('./pages/system/system.routes').then((m) => m.SYSTEM_ROUTES),
        data: { keepAlive: true }
      },
      {
        path: 'vacation',
        loadChildren: () =>
          import('./pages/vacation/vacation.routes').then((m) => m.VACATION_ROUTES),
        data: { keepAlive: true }
      },
      {
        path: 'special-tags',
        loadChildren: () =>
          import('./pages/special-tags/special-tags.routes').then((m) => m.SPECIAL_TAGS_ROUTES),
        data: { keepAlive: true }
      },
      {
        path: 'admins',
        loadComponent: () => import('./pages/admins/admins.page').then((m) => m.AdminsPage),
        data: { keepAlive: true }
      },
      {
        path: 'roles',
        loadChildren: () => import('./pages/roles/roles.routes').then((m) => m.ROLES_ROUTES),
        data: { keepAlive: true }
      },
      {
        path: 'rules',
        loadChildren: () => import('./pages/rules/rules.routes').then((m) => m.RULES_ROUTES),
        data: { keepAlive: true }
      },
      {
        path: 'advertisements',
        loadComponent: () =>
          import('./pages/advertisements/advertisements.page').then((m) => m.AdvertisementsPage),
        data: { keepAlive: true }
      },
      {
        path: 'menus',
        loadComponent: () => import('./pages/menus/menus.page').then((m) => m.MenusPage),
        data: { keepAlive: true }
      },
      {
        path: 'pages',
        loadComponent: () => import('./pages/pages/pages.page').then((m) => m.PagesPage),
        data: { keepAlive: true }
      }
    ]
  }
]
