import { Injectable } from '@angular/core'
import { CanActivate, Router, UrlTree } from '@angular/router'
import { AuthService } from '../services/auth.service'
import { MessageService } from 'primeng/api'

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private message: MessageService
  ) {}

  canActivate(): boolean | UrlTree {
    if (this.auth.isLoggedIn()) {
      return true
    } else {
      this.message.add({
        severity: 'error',
        summary: 'Not Logged In',
        detail: 'Please login first.'
      })
      return this.router.createUrlTree(['/backstage/login'])
    }
  }
}
