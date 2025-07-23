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
        path: 'links',
        loadChildren: () => import('./pages/links/links.routes').then((m) => m.LINKS_ROUTES),
        data: { keepAlive: true }
      },
      {
        path: 'jobs',
        loadChildren: () => import('./pages/jobs/job.routes').then((m) => m.JOB_ROUTES),
        data: { keepAlive: true }
      },
      {
        path: 'configs',
        loadChildren: () => import('./pages/configs/config.routes').then((m) => m.CONFIG_ROUTES),
        data: { keepAlive: true }
      },
      {
        path: 'systems',
        loadChildren: () => import('./pages/system/system.routes').then((m) => m.SYSTEM_ROUTES),
        data: { keepAlive: true }
      },
      {
        path: 'holidays',
        loadChildren: () =>
          import('./pages/holidays/holidays.routes').then((m) => m.HOLIDAYS_ROUTES),
        data: { keepAlive: true }
      },
      {
        path: 'attrs',
        loadChildren: () => import('./pages/attrs/attrs.routes').then((m) => m.ATTRS_ROUTES),
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
        path: 'ads',
        loadChildren: () => import('./pages/ads/ads.routes').then((m) => m.ADS_ROUTES),
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
      },
      {
        path: 'operate-logs',
        loadChildren: () =>
          import('./pages/operate-logs/operate-logs.routes').then((m) => m.OPERATE_LOGS_ROUTES),
        data: { keepAlive: true }
      },
      {
        path: 'caches',
        loadChildren: () => import('./pages/cache/caches.routes').then((m) => m.CACHES_ROUTES),
        data: { keepAlive: true }
      }
    ]
  }
]
