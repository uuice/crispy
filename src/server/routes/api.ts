import { Router } from 'express'
import { createExpressMiddleware } from '@trpc/server/adapters/express'
import { appRouter } from '../trpc/trpc.router'
import { createContext } from '../trpc/context'
import adminRoutes from './admin-routes'
import contentRoutes from './content-routes'

// Create API router
const router = Router()

// Mount tRPC routes for admin (JWT authentication)
router.use('/trpc', createExpressMiddleware({ router: appRouter, createContext }))

// Mount tRPC routes for content (Access Token authentication)
router.use('/trpc-content', createExpressMiddleware({ router: appRouter, createContext }))

// Mount admin routes
router.use('/admin', adminRoutes)

// Mount content routes
router.use('/content', contentRoutes)

export default router
