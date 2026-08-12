declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PAYLOAD_SECRET: string
      DATABASE_URL: string
      NEXT_PUBLIC_SERVER_URL: string
      VERCEL_PROJECT_PRODUCTION_URL: string
      /** Runtime public origin for redirects (not baked at build). */
      CRISPY_PUBLIC_ORIGIN?: string
      /** Middleware loopback origin, e.g. http://127.0.0.1:3333 */
      CRISPY_INTERNAL_ORIGIN?: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
