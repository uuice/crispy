'use client'

import React, { useEffect, useRef } from 'react'

import { useAdminTheme } from './useAdminTheme'
import 'swagger-ui-dist/swagger-ui.css'
import './swagger-ui.scss'

type Props = {
  specUrl: string
}

export function SwaggerUIView({ specUrl }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const theme = useAdminTheme()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let cancelled = false
    let ui: { destroy?: () => void } | undefined

    void import('swagger-ui-dist/swagger-ui-es-bundle').then((module) => {
      if (cancelled) return

      const SwaggerUIBundle = module.default

      // BaseLayout (apis preset only) — no StandaloneLayout / standalone-preset bundle needed.
      ui = SwaggerUIBundle({
        domNode: container,
        url: specUrl,
        docExpansion: 'list',
        defaultModelsExpandDepth: 1,
        persistAuthorization: true,
        tryItOutEnabled: true,
        presets: [SwaggerUIBundle.presets.apis],
      })
    })

    return () => {
      cancelled = true
      ui?.destroy?.()
      container.replaceChildren()
    }
  }, [specUrl])

  return (
    <div
      className={`swagger-docs swagger-docs--${theme} swagger-docs__mount`}
      data-theme={theme}
      ref={containerRef}
    />
  )
}

export default SwaggerUIView
