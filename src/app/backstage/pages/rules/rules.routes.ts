import { Routes } from '@angular/router'

export const RULES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./rules.page').then((m) => m.RulesPage)
  }
]
