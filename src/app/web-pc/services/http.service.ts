import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'

@Injectable({ providedIn: 'root' })
export class HttpService {
  constructor(private http: HttpClient) {}

  /**
   * Get access token from localStorage
   */
  private getAccessToken(): string | null {
    return localStorage.getItem('x-access-token') || '123123'
  }

  /**
   * Create headers with x-access-token if token exists
   */
  private createHeaders(extraHeaders?: { [key: string]: string }): HttpHeaders {
    let headers = new HttpHeaders(extraHeaders || {})
    const token = this.getAccessToken()
    if (token) {
      headers = headers.set('x-access-token', token)
      headers = headers.set('x-app-name', 'uuice')
      headers = headers.set('x-channel', 'web')
    }
    return headers
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse) {
    let msg = 'Request failed.'
    if (error.error && error.error.message) {
      msg = error.error.message
    } else if (error.status === 0) {
      msg = 'Network error, please check your connection.'
    } else if (error.status) {
      msg = `Error ${error.status}: ${error.statusText}`
    }
    console.error('HTTP Error:', msg)
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

  /**
   * HTTP PATCH request
   */
  patch<T>(url: string, body: any, headers?: { [key: string]: string }): Observable<T> {
    return this.http
      .patch<T>(url, body, {
        headers: this.createHeaders(headers)
      })
      .pipe(catchError((err) => this.handleError(err)))
  }
}
