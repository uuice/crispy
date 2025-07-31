import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError, timeout } from 'rxjs/operators'
import { MessageService } from 'primeng/api'
import { AuthService } from './auth.service'
import { Router } from '@angular/router'

@Injectable({ providedIn: 'root' })
export class HttpService {
  constructor(
    private http: HttpClient,
    private message: MessageService,
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Get JWT token from localStorage
   */
  private getToken(): string | null {
    return localStorage.getItem('jwt_token')
  }

  /**
   * Create headers with Authorization if token exists
   */
  private createHeaders(extraHeaders?: { [key: string]: string }): HttpHeaders {
    let headers = new HttpHeaders(extraHeaders || {})
    const token = this.getToken()
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  }

  /**
   * Handle HTTP errors and show toast
   */
  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      this.authService.clearAll()

      this.message.add({
        severity: 'warn',
        summary: '会话过期',
        detail: '您的登录已过期，请重新登录'
      })

      this.router.navigate(['/backstage/login'])

      return throwError(() => error)
    }

    let msg = 'Request failed.'
    if (error.error && error.error.message) {
      msg = error.error.message
    } else if (error.status === 0) {
      msg = 'Network error, please check your connection.'
    } else if (error.status) {
      msg = `Error ${error.status}: ${error.statusText}`
    }
    this.message.add({ severity: 'error', summary: 'Error', detail: msg })
    return throwError(() => error)
  }

  /**
   * HTTP GET request
   */
  get<T>(url: string, params?: any, headers?: { [key: string]: string }): Observable<T> {
    return this.http
      .get<T>(url, {
        headers: this.createHeaders(headers),
        params: new HttpParams({ fromObject: params || {} })
      })
      .pipe(catchError((err) => this.handleError(err)))
  }

  /**
   * HTTP POST request
   */
  post<T>(url: string, body: any, headers?: { [key: string]: string }): Observable<T> {
    return this.http
      .post<T>(url, body, {
        headers: this.createHeaders(headers)
      })
      .pipe(catchError((err) => this.handleError(err)))
  }

  /**
   * HTTP POST request with extended timeout for long-running operations
   */
  postWithTimeout<T>(
    url: string,
    body: any,
    timeoutMs: number = 300000,
    headers?: { [key: string]: string }
  ): Observable<T> {
    return this.http
      .post<T>(url, body, {
        headers: this.createHeaders(headers)
      })
      .pipe(
        timeout(timeoutMs),
        catchError((err) => this.handleError(err))
      )
  }

  /**
   * HTTP PUT request
   */
  put<T>(url: string, body: any, headers?: { [key: string]: string }): Observable<T> {
    return this.http
      .put<T>(url, body, {
        headers: this.createHeaders(headers)
      })
      .pipe(catchError((err) => this.handleError(err)))
  }

  /**
   * HTTP DELETE request
   */
  delete<T>(url: string, params?: any, headers?: { [key: string]: string }): Observable<T> {
    return this.http
      .delete<T>(url, {
        headers: this.createHeaders(headers),
        params: new HttpParams({ fromObject: params || {} })
      })
      .pipe(catchError((err) => this.handleError(err)))
  }
}
