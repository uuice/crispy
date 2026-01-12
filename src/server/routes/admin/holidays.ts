import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'
import { holidayService } from '../../services/holidayService'

// Validation schemas
const createHolidaySchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  value: z.string().min(1, '日期不能为空'),
  sort: z.number().default(0)
})

const updateHolidaySchema = createHolidaySchema.partial()

// Get single holiday
export const getHoliday = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const holiday = await holidayService.getHolidayById(id)

    if (!holiday) {
      notFound(res, 'Holiday not found')
      return
    }

    success(res, holiday)
  } catch (err: unknown) {
    console.error('Error fetching holiday:', err)
    error(res, 'Internal server error')
  }
}

// Get holidays list with pagination
export const getHolidays = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10

    const filters = {
      title: req.query['title'] as string | undefined,
      value: req.query['value'] as string | undefined,
      sort: req.query['sort'] !== undefined ? parseInt(req.query['sort'] as string) : undefined,
      is_delete:
        req.query['is_delete'] !== undefined
          ? parseInt(req.query['is_delete'] as string)
          : undefined,
      update_time: req.query['update_time']
        ? parseInt(req.query['update_time'] as string)
        : undefined,
      create_time: req.query['create_time']
        ? parseInt(req.query['create_time'] as string)
        : undefined,
      start_time:
        req.query['start_time'] !== undefined
          ? parseInt(req.query['start_time'] as string)
          : undefined,
      end_time:
        req.query['end_time'] !== undefined ? parseInt(req.query['end_time'] as string) : undefined
    }

    const result = await holidayService.getHolidays(filters, { page, pageSize })

    success(res, result)
  } catch (err: unknown) {
    console.error('Error fetching holidays:', err)
    error(res, 'Internal server error')
  }
}

// Create new holiday
export const createHoliday = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = createHolidaySchema.parse(req.body)

    const result = await holidayService.createHoliday(validatedData)

    success(res, result, 'Holiday created successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.issues)
      return
    }
    console.error('Error creating holiday:', err)
    error(res, 'Internal server error')
  }
}

// Update holiday
export const updateHoliday = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const validatedData = updateHolidaySchema.parse(req.body)

    const result = await holidayService.updateHoliday(id, validatedData)

    if (!result.success) {
      notFound(res, 'Holiday not found')
      return
    }

    success(res, { id, ...validatedData }, 'Holiday updated successfully')
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      validationError(res, err.issues)
      return
    }
    console.error('Error updating holiday:', err)
    error(res, 'Internal server error')
  }
}

// Delete holiday (logical delete)
export const deleteHoliday = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, 'Invalid ID', 400)
      return
    }

    const result = await holidayService.deleteHoliday(id)

    if (!result.success) {
      notFound(res, 'Holiday not found')
      return
    }

    success(res, null, 'Holiday deleted successfully')
  } catch (err: unknown) {
    console.error('Error deleting holiday:', err)
    error(res, 'Internal server error')
  }
}

// Export all functions as a controller object
export const holidayController = {
  getHoliday,
  getHolidays,
  createHoliday,
  updateHoliday,
  deleteHoliday
}

import { Elysia } from 'elysia'
const holidayRouter = new Elysia({
  prefix: '/holidays'
})
  .get('/', getHolidays)
  .get('/:id', getHoliday)
  .post('/', createHoliday)
  .put('/:id', updateHoliday)
  .delete('/:id', deleteHoliday)
export default holidayRouter
