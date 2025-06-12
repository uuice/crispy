import { Router } from 'express'
import { prisma } from '../utils/prisma'

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

// Get users list
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        status: true,
        createdAt: true,
        roles: {
          select: {
            name: true,
            description: true
          }
        }
      },
      where: {
        deletedAt: null
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.json({
      code: 0,
      data: users,
      message: 'Success'
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({
      code: 500,
      message: 'Internal server error'
    })
  }
})

export default router
