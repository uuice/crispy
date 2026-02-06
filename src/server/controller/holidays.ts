import { NextFunction, Request, Response } from 'express'
import { error, handleError, success } from '../utils/response'
import { holidayService } from '../services/holidayService'
import { HolidayFilters } from '@src/types'

// Get single holiday
export const getHoliday = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params['id'])
    if (isNaN(id)) {
      error(res, '无效的ID', 400)
      return
    }

    const holiday = await holidayService.getById(id)

    if (!holiday) {
      error(res, '节假日不存在', 404)
      return
    }

    success(res, holiday)
  } catch (err: unknown) {
    handleError(res, err, 'getHoliday')
  }
}

// Get holidays list with pagination
export const getHolidays = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await holidayService.getHolidays(req.query as unknown as HolidayFilters)

    success(res, result)
  } catch (err: unknown) {
    handleError(res, err, 'getHolidays')
  }
}

// Create new holiday
export const createHoliday = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await holidayService.create(req.body)

    success(res, result, '节假日创建成功')
  } catch (err: unknown) {
    handleError(res, err, 'createHoliday')
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
      error(res, '无效的ID', 400)
      return
    }

    const result = await holidayService.update(id, req.body)
    success(res, result, '节假日更新成功')
  } catch (err: unknown) {
    handleError(res, err, 'updateHoliday')
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
      error(res, '无效的ID', 400)
      return
    }

    const deleted = await holidayService.delete(id)
    if (!deleted) {
      error(res, '节假日不存在', 404)
      return
    }

    success(res, null, '节假日删除成功')
  } catch (err: unknown) {
    handleError(res, err, 'deleteHoliday')
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
