declare module 'swagger-ui-dist/swagger-ui-es-bundle' {
  type SwaggerUIBundleOptions = {
    domNode?: HTMLElement
    url?: string
    docExpansion?: 'list' | 'full' | 'none'
    defaultModelsExpandDepth?: number
    persistAuthorization?: boolean
    tryItOutEnabled?: boolean
    presets?: unknown[]
    plugins?: unknown[]
    layout?: string
  }

  type SwaggerUIBundle = ((options: SwaggerUIBundleOptions) => { destroy?: () => void }) & {
    presets: { apis: unknown }
    plugins: { DownloadUrl?: unknown }
  }

  const SwaggerUIBundle: SwaggerUIBundle
  export default SwaggerUIBundle
}
