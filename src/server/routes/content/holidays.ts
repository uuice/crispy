import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { success, error, validationError, notFound } from '../../utils/response'
import { holidayService } from '../../services/holidayService'

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

// Export all functions as a controller object
export const holidayController = {
  getHoliday,
  getHolidays
}
