// src/libs/express_jsx.ts
import { renderToString } from 'react-dom/server' // 统一使用 renderToString
import React from 'react'
import { Request, Response, NextFunction } from 'express'
import path from 'node:path'

export type JSXComponent<P = Record<string, unknown>> =
  | React.FunctionComponent<P>
  | React.ComponentClass<P>
  | ((props: P) => React.ReactElement | Promise<React.ReactElement>)

interface JSXEngineOptions {
  viewsDir?: string
  extension?: string
  cache?: boolean
}

const templateCache = new Map<string, JSXComponent>()

export class JSXEngine {
  private viewsDir: string
  private extension: string
  private cache: boolean

  constructor(options: JSXEngineOptions = {}) {
    this.viewsDir = options.viewsDir || path.join(process.cwd(), 'src', 'views')
    this.extension = options.extension || '.tsx'
    this.cache = options.cache ?? true
  }

  // 统一使用异步渲染
  async render<P extends Record<string, unknown> = Record<string, unknown>>(
    component: JSXComponent<P>,
    props: P = {} as P
  ): Promise<string> {
    try {
      // 检查是否为异步函数
      const isAsyncFunction = component.constructor.name === 'AsyncFunction'

      if (isAsyncFunction) {
        // 直接执行异步组件并等待结果
        const result = await (
          component as (props: Record<string, unknown>) => Promise<React.ReactElement>
        )(props)
        return renderToString(result)
      } else {
        // 同步组件直接渲染
        const element = React.createElement(
          component as React.ComponentType<Record<string, unknown>>,
          props
        )
        return renderToString(element)
      }
    } catch (error: unknown) {
      console.error('JSX rendering error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Failed to render JSX component: ${errorMessage}`, { cause: error })
    }
  }

  async renderFile<P extends Record<string, unknown> = Record<string, unknown>>(
    templatePath: string,
    props: P = {} as P
  ): Promise<string> {
    try {
      const fullPath = path.join(this.viewsDir, templatePath + this.extension)
      let component: JSXComponent

      if (this.cache && templateCache.has(fullPath)) {
        component = templateCache.get(fullPath)!
      } else {
        const module = await import(fullPath)
        component = module.default || module

        if (this.cache) {
          templateCache.set(fullPath, component)
        }
      }

      return await this.render(component, props)
    } catch (error: unknown) {
      console.error('JSX template loading error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Failed to load JSX template ${templatePath}: ${errorMessage}`, {
        cause: error
      })
    }
  }

  clearCache(): void {
    templateCache.clear()
  }

  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      res.renderJSX = async <P extends Record<string, unknown> = Record<string, unknown>>(
        templatePath: string,
        props: P = {} as P
      ) => {
        try {
          const html = await this.renderFile(templatePath, { ...props, req, res })
          res.setHeader('Content-Type', 'text/html')
          res.send(html)
        } catch (error) {
          next(error)
        }
      }

      res.renderJSXString = async <P extends Record<string, unknown> = Record<string, unknown>>(
        component: JSXComponent<P>,
        props: P = {} as P
      ) => {
        try {
          const html = await this.render(component, { ...props, req, res })
          res.setHeader('Content-Type', 'text/html')
          res.send(html)
        } catch (error) {
          next(error)
        }
      }

      next()
    }
  }
}

declare module 'express-serve-static-core' {
  interface Response {
    renderJSX: <P extends Record<string, unknown> = Record<string, unknown>>(
      templatePath: string,
      props?: P
    ) => Promise<void>
    renderJSXString: <P extends Record<string, unknown> = Record<string, unknown>>(
      component: JSXComponent<P>,
      props?: P
    ) => Promise<void>
  }
}

export function createJSXEngine(options?: JSXEngineOptions): JSXEngine {
  return new JSXEngine(options)
}

export function useJSXEngine(
  app: { use: (middleware: any) => void },
  options?: JSXEngineOptions
): JSXEngine {
  const engine = new JSXEngine(options)
  app.use(engine.middleware())
  return engine
}

export default {
  JSXEngine,
  createJSXEngine,
  useJSXEngine
}
