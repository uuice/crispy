import { Injectable, inject, PLATFORM_ID } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { isPlatformServer } from '@angular/common'

// API Response interface
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: any
}

// Pagination interface
export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginatedResult<T> {
  dataList: T[]
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

@Injectable({ providedIn: 'root' })
export class HttpService {
  private platformId = inject(PLATFORM_ID)

  constructor(private http: HttpClient) {
    // 初始化时打印调试信息
    this.logEnvironmentInfo()
  }

  /**
   * Log environment information for debugging
   */
  private logEnvironmentInfo() {
    const isServer = isPlatformServer(this.platformId)
    const env = typeof process !== 'undefined' && process.env ? process.env : {}

    console.log('=== HTTP Service Environment Info ===')
    console.log('Is Server:', isServer)
    console.log('NODE_ENV:', env['NODE_ENV'] || 'unknown')
    console.log('SSR_API_BASE_URL:', env['SSR_API_BASE_URL'] || 'not set')
    console.log('STATIC_GENERATION_BASE_URL:', env['STATIC_GENERATION_BASE_URL'] || 'not set')
    console.log('====================================')
  }

  /**
   * Get API base URL for SSR optimization
   */
  private getApiBaseUrl(): string {
    // 在SSR环境下从环境变量获取API基础URL
    if (isPlatformServer(this.platformId)) {
      // 优先使用 SSR_API_BASE_URL，如果没有则使用 STATIC_GENERATION_BASE_URL，最后使用默认值
      const ssrApiBaseUrl =
        typeof process !== 'undefined' && process.env
          ? process.env['SSR_API_BASE_URL'] ||
            process.env['STATIC_GENERATION_BASE_URL'] ||
            process.env['BASE_URL'] ||
            'http://localhost:4000'
          : 'http://localhost:4000'

      // console.log('SSR API Base URL:', ssrApiBaseUrl)
      return ssrApiBaseUrl
    }
    // 客户端环境下使用相对路径
    // console.log('Client-side API - using relative path')
    return ''
  }

  /**
   * Build full URL for API requests
   */
  private buildUrl(url: string): string {
    const baseUrl = this.getApiBaseUrl()
    // 确保URL以/开头
    const cleanUrl = url.startsWith('/') ? url : `/${url}`
    const fullUrl = `${baseUrl}${cleanUrl}`
    console.log(`Building URL: ${url} -> ${fullUrl}`)
    return fullUrl
  }

  /**
   * Get access token from localStorage
   */
  private getAccessToken(): string | null {
    return '123123'
  }

  /**
   * Create headers with x-access-token if token exists
   */
  private createHeaders(extraHeaders?: { [key: string]: string }): HttpHeaders {
    let headers = new HttpHeaders(extraHeaders || {})
    const token = this.getAccessToken()
    if (token) {
      headers = headers.set('x-access-token', 'web_token_123456789')
      headers = headers.set('x-app-name', 'WebApp')
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
    const fullUrl = this.buildUrl(url)
    return this.http
      .get<T>(fullUrl, {
        headers: this.createHeaders(headers),
        params: new HttpParams({ fromObject: params || {} })
      })
      .pipe(catchError((err) => this.handleError(err)))
  }

  /**
   * HTTP POST request
   */
  post<T>(url: string, body: any, headers?: { [key: string]: string }): Observable<T> {
    const fullUrl = this.buildUrl(url)
    return this.http
      .post<T>(fullUrl, body, {
        headers: this.createHeaders(headers)
      })
      .pipe(catchError((err) => this.handleError(err)))
  }

  /**
   * HTTP PUT request
   */
  put<T>(url: string, body: any, headers?: { [key: string]: string }): Observable<T> {
    const fullUrl = this.buildUrl(url)
    return this.http
      .put<T>(fullUrl, body, {
        headers: this.createHeaders(headers)
      })
      .pipe(catchError((err) => this.handleError(err)))
  }

  /**
   * HTTP DELETE request
   */
  delete<T>(url: string, params?: any, headers?: { [key: string]: string }): Observable<T> {
    const fullUrl = this.buildUrl(url)
    return this.http
      .delete<T>(fullUrl, {
        headers: this.createHeaders(headers),
        params: new HttpParams({ fromObject: params || {} })
      })
      .pipe(catchError((err) => this.handleError(err)))
  }

  /**
   * HTTP PATCH request
   */
  patch<T>(url: string, body: any, headers?: { [key: string]: string }): Observable<T> {
    const fullUrl = this.buildUrl(url)
    return this.http
      .patch<T>(fullUrl, body, {
        headers: this.createHeaders(headers)
      })
      .pipe(catchError((err) => this.handleError(err)))
  }
}
