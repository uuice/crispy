// src/libs/express_jsx.ts
import { renderToString } from 'react-dom/server'
import React from 'react'
import { Request, Response, NextFunction } from 'express'

export type JSXComponent<P = Record<string, unknown>> =
  | React.FunctionComponent<P>
  | React.ComponentClass<P>
  | ((props: P) => React.ReactElement | Promise<React.ReactElement>)

interface JSXEngineOptions {
  cache?: boolean
}

export class JSXEngine {
  private cache: boolean

  constructor(options: JSXEngineOptions = {}) {
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

  clearCache(): void {
    // Cache cleared (no longer used)
  }

  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      res.renderJSX = async <P extends Record<string, unknown> = Record<string, unknown>>(
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
      component: JSXComponent<P>,
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
