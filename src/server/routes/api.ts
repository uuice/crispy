import { Router } from 'express'
import adminRoutes from './admin/routes'
import contentRoutes from './content/routes'

// Create API router
const router = Router()

// Mount admin routes
router.use('/admin', adminRoutes)

// Mount content routes
router.use('/content', contentRoutes)

export default router
