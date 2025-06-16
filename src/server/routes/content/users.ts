import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { userService } from '../../services/userService'

// Get single user
export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid ID' })
      return
    }

    const user = await userService.getUserById(id)
    res.json(user)
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'User not found') {
      res.status(404).json({ error: 'User not found' })
      return
    }
    console.error('Error fetching user:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Get users list with pagination
export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10

    const result = await userService.getUsers({ page, pageSize })
    res.json(result)
  } catch (error: unknown) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Export all functions as a controller object
export const userController = {
  getUser,
  getUsers
}
