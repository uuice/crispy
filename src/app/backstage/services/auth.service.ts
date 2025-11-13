import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'jwt_token'
  private readonly USER_KEY = 'user_info'
  private readonly MENU_KEY = 'menu_info'

  /**
   * Save JWT token to localStorage
   */
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token)
  }

  /**
   * Get JWT token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  /**
   * Remove JWT token from localStorage
   */
  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY)
  }

  /**
   * Save user info to localStorage (as JSON string)
   */
  setUser(user: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user))
  }

  /**
   * Get user info from localStorage (parsed as object)
   */
  getUser<T = any>(): T | null {
    const user = localStorage.getItem(this.USER_KEY)
    return user ? (JSON.parse(user) as T) : null
  }

  /**
   * Remove user info from localStorage
   */
  clearUser(): void {
    localStorage.removeItem(this.USER_KEY)
  }

  setMenu(menu: any): void {
    localStorage.setItem(this.MENU_KEY, JSON.stringify(menu))
  }

  getMenu<T = any>(): T | null {
    const menu = localStorage.getItem(this.MENU_KEY)
    return menu ? (JSON.parse(menu) as T) : null
  }

  clearMenu(): void {
    localStorage.removeItem(this.MENU_KEY)
  }

  /**
   * Clear all auth info (token and user)
   */
  clearAll(): void {
    this.clearToken()
    this.clearUser()
    this.clearMenu()
  }

  /**
   * Check if user is logged in (token exists)
   */
  isLoggedIn(): boolean {
    return !!this.getToken()
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  logout(): void {
    this.clearAll()
  }
}
