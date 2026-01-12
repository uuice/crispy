import { Elysia, t } from 'elysia'
import jwt from 'jsonwebtoken'
import { env } from '../../config/env'
import userRouter from './users'
import adRouter from './ads'
import adItemRouter from './ad-items'
import additionRouter from './additions'
import apiLogRouter from './api-logs'
import articleRouter from './articles'
import attrRouter from './attrs'
import categoryRouter from './categories'
import cacheRouter from './caches'
import configRouter from './configs'
import jobRouter from './jobs'
import linkRouter from './links'
import enumRouter from './enums'
import holidayRouter from './holidays'
import keywordRouter from './keywords'
import noticeRouter from './notices'
import roleRouter from './roles'
import menuRouter from './menus'
import operateLogRouter from './operate-logs'
import ruleRouter from './rules'
import pageRouter from './pages'
import voteRouter from './votes'
import accessTokenRouter from './access-token'
import systemRouter from './system'
import commentRouter from './comments'
import dashboardRouter from './dashboard'
import staticGenerationRouter from './static-generation'
import tagRouter from './tags'
import uploadRouter from './upload'
import userTypeRouter from './user-types'
import voteItemRouter from './vote-items'

// Define user type
export interface JwtUser {
  id: string
  user_name: string
  real_name: string
  nick_name: string
  avatar_url: string
  // Add other user properties as needed
}

// Create the admin router with JWT authentication
const adminRouter = new Elysia({
  prefix: '/admin',
  detail: {
    tags: ['admin-api'],
    security: [
      {
        bearerAuth: []
      }
    ]
  }
})
  // Apply JWT authentication to all routes in this router
  .derive(async ({ headers, set }) => {
    // Get token from Authorization header
    const authHeader = headers['authorization']
    const token = authHeader?.split(' ')[1] // Bearer TOKEN format

    if (!token) {
      set.status = 401
      throw new Error('No token provided')
    }

    try {
      // Verify and decode token using environment variable
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtUser

      // Return the decoded user info
      return { user: decoded }
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        set.status = 401
        throw new Error('Invalid token')
      }
      if (error instanceof jwt.TokenExpiredError) {
        set.status = 401
        throw new Error('Token expired')
      }

      set.status = 500
      throw new Error('Internal server error')
    }

    // return {
    //   user: {
    //     id: '1',
    //     user_name: 'admin',
    //     real_name: 'Administrator',
    //     nick_name: 'Admin',
    //     avatar_url: ''
    //   }
    // }
  })
  // Operation log hook for POST, PUT, DELETE requests
  .derive(async ({ request, body, query, params, user }) => {
    const method = request.method
    const url = new URL(request.url)
    const path = url.pathname

    if (['POST', 'PUT', 'DELETE'].includes(method)) {
      // Prepare operation log data to be stored later
      let filteredBody = body as Record<string, any>
      // If body contains file or files, remove them
      if (filteredBody && typeof filteredBody === 'object') {
        filteredBody = { ...filteredBody }
        if ('file' in filteredBody) delete filteredBody['file']
        if ('files' in filteredBody) delete filteredBody['files']
      }
      // Build content string with method, path, query, and filtered body
      const content = `method: ${method}, path: ${path}, query: ${JSON.stringify(query)}, body: ${JSON.stringify(filteredBody)}`

      const logData = {
        code: method + ':' + path + ':' + (params['id'] || ''),
        content,
        type_id: 0, // Adjust type_id as needed
        user_id: Number(user?.id || 0)
      }

      // Store log data in context for later processing
      return { pendingOperationLog: logData }
    }

    // Return empty object to not interfere with existing context
    return { pendingOperationLog: null }
  })
  .onAfterHandle(async ({ pendingOperationLog, status }) => {
    // Process operation log after response is sent
    console.log('Processing operation log...')
    if (pendingOperationLog) {
      try {
        // Import the operateLogService here or use a similar service
        const { operateLogService } = await import('../../services/operateLogService')

        await operateLogService.createOperateLog(pendingOperationLog)
      } catch (e) {
        // Log error but do not affect main flow
        console.error('OperateLog Error:', e)
      }
    }
  })
  .get('/test', async ({ user }) => {
    console.log('User:', user)
    return {
      message: 'Admin API is working!',
      user: user // Return user info to confirm authentication worked
    }
  })
  // User routes
  .use(userRouter)
  // Ad routes
  .use(adRouter)
  // Ad item routes
  .use(adItemRouter)
  // Addition routes
  .use(additionRouter)
  // API log routes
  .use(apiLogRouter)
  // Article routes
  .use(articleRouter)
  // Category routes
  .use(categoryRouter)
  // Attrs routes
  .use(attrRouter)
  // Caches routes
  .use(cacheRouter)
  // Page cache management routes
  .use(cacheRouter)
  // Configs routes
  .use(configRouter)
  // Enums routes
  .use(enumRouter)
  // Holidays routes
  .use(holidayRouter)
  //Job routes
  .use(jobRouter)
  // Keyword routes
  .use(keywordRouter)
  // Link routes
  .use(linkRouter)
  // Menu routes
  .use(menuRouter)
  // Notice routes
  .use(noticeRouter)
  // Operate log routes
  .use(operateLogRouter)
  // Role routes
  .use(roleRouter)
  // Rule routes
  .use(ruleRouter)
  // Tag routes
  .use(tagRouter)
  // Page routes
  .use(pageRouter)
  // User type routes
  .use(userTypeRouter)
  // Vote routes
  .use(voteRouter)
  // Vote item routes
  .use(voteItemRouter)
  // Comment routes
  .use(commentRouter)
  // Register access token routes
  .use(accessTokenRouter)
  // Upload routes
  .use(uploadRouter)
  // 注册system信息接口
  .use(systemRouter)
  // Register dashboard overview route
  .use(dashboardRouter)
  // Static generation routes
  .use(staticGenerationRouter)
export default adminRouter
