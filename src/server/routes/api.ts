import { Router, RequestHandler } from 'express'
import { jwtMiddleware } from '../middleware/jwt'
import testRoutes from './test'

// Create API router
const router = Router()

// Create authentication middleware
const authMiddleware: RequestHandler = (req, res, next) => {
  console.log(req)
  if (req.path === '/login' || req.path === '/login/') {
    next()
    return
  }
  jwtMiddleware(req, res, next)
}

// Apply authentication middleware
router.use(authMiddleware)

// Mount test routes
router.use('/test', testRoutes)

// TODO: Add more API routes here
// router.use('/users', userRoutes)
// router.use('/products', productRoutes)

export default router
