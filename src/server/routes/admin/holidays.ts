import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'
import { holidayService } from '../../services/holidayService'

// Validation schemas
const createHolidaySchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
  sort: z.number().default(0)
})

const updateHolidaySchema = createHolidaySchema.partial()

// Get single holiday
export const getHoliday = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
export const getHolidays = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1
    const pageSize = parseInt(req.query['pageSize'] as string) || 10

    // Get filters from query
    const filters = {
      name: req.query['name'] as string | undefined,
      value: req.query['value'] as string | undefined,
      start_time: req.query['start_time'] ? parseInt(req.query['start_time'] as string) : undefined,
      end_time: req.query['end_time'] ? parseInt(req.query['end_time'] as string) : undefined
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
      validationError(res, err.errors)
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
      validationError(res, err.errors)
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
