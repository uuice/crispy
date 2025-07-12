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


    const filters = {
      title: req.query['title'] as string | undefined,
      value: req.query['value'] as string | undefined,
      sort: req.query['sort'] ? parseInt(req.query['sort'] as string) : undefined,
      is_delete: req.query['is_delete'] ? parseInt(req.query['is_delete'] as string) : undefined,
      update_time: req.query['update_time']
        ? parseInt(req.query['update_time'] as string)
        : undefined,
      create_time: req.query['create_time']
        ? parseInt(req.query['create_time'] as string)
        : undefined
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
