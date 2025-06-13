import { Router } from 'express'
import adminRoutes from './admin/routes'

// Create API router
const router = Router()

// Mount admin routes
router.use('/admin', adminRoutes)

// TODO: Add more API routes here
// router.use('/users', userRoutes)
// router.use('/products', productRoutes)

export default router
