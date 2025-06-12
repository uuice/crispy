import { Router } from 'express'

const router = Router()

// Test route A
router.get('/a', (req, res) => {
  res.json({
    message: 'This is test route A',
    timestamp: new Date().toISOString()
  })
})

// Test route B
router.get('/b', (req, res) => {
  res.json({
    message: 'This is test route B',
    timestamp: new Date().toISOString()
  })
})

export default router
