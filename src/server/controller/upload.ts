import { NextFunction, Request, Response } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { error, handleError, success } from '../utils/response'

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, `image-${uniqueSuffix}${ext}`)
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  }
})

// Upload single image
export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    upload.single('image')(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            error(res, '文件大小不能超过5MB', 400)
            return
          }
        }
        error(res, err.message || '文件上传失败', 400)
        return
      }

      if (!req.file) {
        error(res, '没有选择文件', 400)
        return
      }

      // Generate public URL for the uploaded file
      const publicUrl = `/uploads/${req.file.filename}`

      success(
        res,
        {
          url: publicUrl,
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size
        },
        '图片上传成功'
      )
    })
  } catch (err: unknown) {
    handleError(res, err, 'uploadImage')
  }
}

// Export all functions as a controller object
export const uploadController = {
  uploadImage
}
