import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router'

export class CustomReuseStrategy implements RouteReuseStrategy {
  private handlers = new Map<string, DetachedRouteHandle>()

  // Only cache routes with data: { keepAlive: true }
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    const shouldDetach = !!route.data && !!route.data['keepAlive']
    const key = this.getRouteKey(route)
    // console.log('shouldDetach:', key, shouldDetach, {
    //   url: route.url.map((s) => s.path),
    //   path: route.routeConfig?.path,
    //   data: route.data
    // })
    return shouldDetach
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    if (route.routeConfig && handle) {
      const key = this.getRouteKey(route)
      this.handlers.set(key, handle)
      // console.log('store:', key, {
      //   url: route.url.map((s) => s.path),
      //   path: route.routeConfig?.path
      // })
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const key = this.getRouteKey(route)
    const shouldAttach = !!route.routeConfig && !!this.handlers.get(key)
    // console.log('shouldAttach:', key, shouldAttach, {
    //   url: route.url.map((s) => s.path),
    //   path: route.routeConfig?.path
    // })
    return shouldAttach
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    if (!route.routeConfig) return null
    const key = this.getRouteKey(route)
    const handle = this.handlers.get(key) || null
    // console.log('retrieve:', key, !!handle, {
    //   url: route.url.map((s) => s.path),
    //   path: route.routeConfig?.path
    // })
    return handle
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    const shouldReuse = future.routeConfig === curr.routeConfig
    // console.log('shouldReuse:', future.routeConfig?.path, curr.routeConfig?.path, shouldReuse)
    return shouldReuse
  }

  // Generate unique route key
  private getRouteKey(route: ActivatedRouteSnapshot): string {
    // Use the full URL path for unique identification
    const urlSegments = route.url.map((segment) => segment.path)

    // If we have URL segments, use them
    if (urlSegments.length > 0) {
      return urlSegments.join('/')
    }

    // For routes without URL segments, use parent + current path
    let key = ''
    if (route.parent && route.parent.routeConfig?.path) {
      key += route.parent.routeConfig.path + '/'
    }
    key += route.routeConfig?.path || ''

    return key || 'default'
  }
}
