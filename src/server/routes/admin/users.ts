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

// Create new user
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await userService.createUser(req.body)
    res.status(201).json(user)
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: (error as z.ZodError).errors })
      return
    }
    console.error('Error creating user:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Update user
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid ID' })
      return
    }

    const user = await userService.updateUser(id, req.body)
    res.json(user)
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: (error as z.ZodError).errors })
      return
    }
    if (error instanceof Error && error.message === 'User not found') {
      res.status(404).json({ error: 'User not found' })
      return
    }
    console.error('Error updating user:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Delete user (logical delete)
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid ID' })
      return
    }

    await userService.deleteUser(id)
    res.json({ message: 'User deleted successfully' })
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'User not found') {
      res.status(404).json({ error: 'User not found' })
      return
    }
    console.error('Error deleting user:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Login user
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await userService.login(req.body)
    res.json(result)
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: (error as z.ZodError).errors })
      return
    }
    if (error instanceof Error) {
      const message = error.message
      if (message === 'Invalid username or password') {
        res.status(401).json({ error: 'Invalid username or password' })
        return
      }
      if (message === 'Account is disabled') {
        res.status(403).json({ error: 'Account is disabled' })
        return
      }
    }
    console.error('Error during login:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Logout user (client-side token removal)
export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Since we're using JWT, we don't need to do anything on the server side
    // The client should remove the token
    res.json({ message: 'Logged out successfully' })
  } catch (error: unknown) {
    console.error('Error during logout:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Reset user password (admin only)
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid user ID' })
      return
    }

    // Check if current user is authenticated
    const currentUser = req.user
    if (!currentUser) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    await userService.resetPassword(id, req.body, parseInt(currentUser.id))
    res.json({ message: 'Password reset successfully' })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: (error as z.ZodError).errors })
      return
    }
    if (error instanceof Error) {
      const message = error.message
      if (message === 'User not found') {
        res.status(404).json({ error: 'User not found' })
        return
      }
      if (message === 'Permission denied. Admin access required.') {
        res.status(403).json({ error: 'Permission denied. Admin access required.' })
        return
      }
      if (message === 'Cannot reset password for disabled user') {
        res.status(400).json({ error: 'Cannot reset password for disabled user' })
        return
      }
    }
    console.error('Error resetting password:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Export all functions as a controller object
export const userController = {
  login,
  logout,
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  resetPassword
}
