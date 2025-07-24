import { RequestHandler, Router } from 'express'
import { userController } from './users'
import { adController } from './ads'
import { additionController } from './additions'
import { adItemController } from './ad-items'
import { apiLogController } from './api-logs'
import { articleController } from './articles'
import { categoryController } from './categories'
import { attrController } from './attrs'
import { cacheController } from './caches'
import { configController } from './configs'
import { enumController } from './enums'
import { holidayController } from './holidays'
import { jobController } from './jobs'
import { keywordController } from './keywords'
import { linkController } from './links'
import { menuController } from './menus'
import { noticeController } from './notices'
import { operateLogController } from './operate-logs'
import { pageController } from './pages'
import { roleController } from './roles'
import { ruleController } from './rules'
import { tagController } from './tags'
import { userTypeController } from './user-types'
import { voteController } from './votes'
import { voteItemController } from './vote-items'
import { commentController } from './comments'
import { jwtMiddleware } from '@src/server/middleware'
import { accessTokenController } from './access-token'
import { uploadController } from './upload'
import { getSystemInfo } from './system'
import { getDashboardOverview } from './dashboard'
import { operateLogService } from '@src/server/services/operateLogService'

const router = Router()

// Create authentication middleware
const authMiddleware: RequestHandler = (req, res, next) => {
  console.log(req.path)
  if (req.path === '/login' || req.path === '/login/') {
    next()
    return
  }
  //  Add JWT middleware
  jwtMiddleware(req, res, next)
}

// Operation log middleware for POST, PUT, DELETE requests
const operateLogMiddleware: RequestHandler = (req, res, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    // Listen for response finish event to log operation
    res.on('finish', async () => {
      try {
        // Get user id from req.user (should be set by JWT middleware)
        const userId = (req as any).user?.id || 0
        // Clone and filter body (remove file info if present)
        let filteredBody = req.body
        // If body contains file or files, remove them
        if (filteredBody && typeof filteredBody === 'object') {
          filteredBody = { ...filteredBody }
          if ('file' in filteredBody) delete filteredBody.file
          if ('files' in filteredBody) delete filteredBody.files
        }
        // Build content string with method, path, query, and filtered body
        const content = `method: ${req.method}, path: ${req.path}, query: ${JSON.stringify(req.query)}, body: ${JSON.stringify(filteredBody)}`

        await operateLogService.createOperateLog({
          code: req.method + ':' + req.path + ':' + req.params['id'] || '',
          content,
          type_id: 0, // Adjust type_id as needed
          user_id: userId
        })
      } catch (e) {
        // Log error but do not affect main flow
        console.error('OperateLog Error:', e)
      }
    })
  }
  next()
}

// Apply authentication middleware
router.use(authMiddleware)

// Apply operation log middleware before all routes
router.use(operateLogMiddleware)

// User routes
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/users', userController.getUsers)
router.get('/users/:id', userController.getUser)
router.post('/users', userController.createUser)
router.put('/users/:id', userController.updateUser)
router.delete('/users/:id', userController.deleteUser)
router.post('/users/:id/reset-password', userController.resetPassword)

// Ad routes
router.get('/ads', adController.getAds)
router.get('/ads/:id', adController.getAd)
router.post('/ads', adController.createAd)
router.put('/ads/:id', adController.updateAd)
router.delete('/ads/:id', adController.deleteAd)

// Ad item routes
router.get('/ad-items', adItemController.getAdItems)
router.get('/ad-items/:id', adItemController.getAdItem)
router.post('/ad-items', adItemController.createAdItem)
router.put('/ad-items/:id', adItemController.updateAdItem)
router.delete('/ad-items/:id', adItemController.deleteAdItem)

// Addition routes
router.get('/additions', additionController.getAdditions)
router.get('/additions/:id', additionController.getAddition)
router.post('/additions', additionController.createAddition)
router.put('/additions/:id', additionController.updateAddition)
router.delete('/additions/:id', additionController.deleteAddition)

// API log routes
router.get('/api-logs', apiLogController.getApiLogs)
router.get('/api-logs/:id', apiLogController.getApiLog)
router.post('/api-logs', apiLogController.createApiLog)
router.put('/api-logs/:id', apiLogController.updateApiLog)
router.delete('/api-logs/:id', apiLogController.deleteApiLog)

// Article routes
router.get('/articles', articleController.getArticles)
router.get('/articles/:id', articleController.getArticle)
router.post('/articles', articleController.createArticle)
router.put('/articles/:id', articleController.updateArticle)
router.delete('/articles/:id', articleController.deleteArticle)

// Category routes
router.get('/categories', categoryController.getCategories)
router.get('/categories/tree', categoryController.getCategoryTree)
router.get('/categories/:id', categoryController.getCategory)
router.post('/categories', categoryController.createCategory)
router.put('/categories/:id', categoryController.updateCategory)
router.delete('/categories/:id', categoryController.deleteCategory)

// Attrs routes
router.get('/attrs', attrController.getAttrs)
router.get('/attrs/:id', attrController.getAttr)
router.post('/attrs', attrController.createAttr)
router.put('/attrs/:id', attrController.updateAttr)
router.delete('/attrs/:id', attrController.deleteAttr)

// Caches routes
router.get('/caches', cacheController.getCaches)
router.get('/caches/:id', cacheController.getCache)
router.post('/caches', cacheController.createCache)
router.put('/caches/:id', cacheController.updateCache)
router.delete('/caches/:id', cacheController.deleteCache)

// Page cache management routes
router.get('/page-cache/stats', cacheController.getCacheStats)
router.get('/page-cache/memory/list', cacheController.getMemoryCacheList)
router.delete('/page-cache/memory/:hash', cacheController.deleteMemoryCache)
router.get('/page-cache/memory/:hash', cacheController.getMemoryCacheInfo)
router.post('/page-cache/memory/cleanup', cacheController.cleanupMemoryCache)

router.get('/page-cache/database/list', cacheController.getDatabaseCacheList)
router.post('/page-cache/database/cleanup', cacheController.clearExpiredDatabaseCache)
router.delete('/page-cache/database/:hash', cacheController.deleteDatabaseCache)
router.get('/page-cache/database/:hash', cacheController.getDatabaseCacheInfo)

// Configs routes
router.get('/configs', configController.getConfigs)
router.get('/configs/alias/:alias', configController.getConfigByAlias)
router.get('/configs/:id', configController.getConfig)
router.post('/configs', configController.createConfig)
router.post('/configs/upsert', configController.upsertConfig)
router.put('/configs/:id', configController.updateConfig)
router.delete('/configs/:id', configController.deleteConfig)

// Enums routes
router.get('/enums', enumController.getEnums)
router.get('/enums/:id', enumController.getEnum)
router.post('/enums', enumController.createEnum)
router.put('/enums/:id', enumController.updateEnum)
router.delete('/enums/:id', enumController.deleteEnum)

// Holidays routes
router.get('/holidays', holidayController.getHolidays)
router.get('/holidays/:id', holidayController.getHoliday)
router.post('/holidays', holidayController.createHoliday)
router.put('/holidays/:id', holidayController.updateHoliday)
router.delete('/holidays/:id', holidayController.deleteHoliday)

// Job routes
router.get('/jobs', jobController.getJobs)
router.get('/jobs/:id', jobController.getJob)
router.post('/jobs', jobController.createJob)
router.put('/jobs/:id', jobController.updateJob)
router.delete('/jobs/:id', jobController.deleteJob)

// Keyword routes
router.get('/keywords', keywordController.getKeywords)
router.get('/keywords/:id', keywordController.getKeyword)
router.post('/keywords', keywordController.createKeyword)
router.put('/keywords/:id', keywordController.updateKeyword)
router.delete('/keywords/:id', keywordController.deleteKeyword)

// Link routes
router.get('/links', linkController.getLinks)
router.get('/links/:id', linkController.getLink)
router.post('/links', linkController.createLink)
router.put('/links/:id', linkController.updateLink)
router.delete('/links/:id', linkController.deleteLink)

// Menu routes
router.get('/menus', menuController.getMenus)
router.get('/menus/tree', menuController.getMenuTree)
router.get('/menus/:id', menuController.getMenu)
router.post('/menus', menuController.createMenu)
router.put('/menus/:id', menuController.updateMenu)
router.delete('/menus/:id', menuController.deleteMenu)

// Notice routes
router.get('/notices', noticeController.getNotices)
router.get('/notices/:id', noticeController.getNotice)
router.post('/notices', noticeController.createNotice)
router.put('/notices/:id', noticeController.updateNotice)
router.delete('/notices/:id', noticeController.deleteNotice)

// Operate log routes
router.get('/operate-logs', operateLogController.getOperateLogs)
router.get('/operate-logs/:id', operateLogController.getOperateLog)
router.post('/operate-logs', operateLogController.createOperateLog)
router.put('/operate-logs/:id', operateLogController.updateOperateLog)
router.delete('/operate-logs/:id', operateLogController.deleteOperateLog)

// Role routes
router.get('/roles', roleController.getRoles)
router.get('/roles/:id', roleController.getRole)
router.post('/roles', roleController.createRole)
router.put('/roles/:id', roleController.updateRole)
router.delete('/roles/:id', roleController.deleteRole)

// Rule routes
router.get('/rules', ruleController.getRules)
router.get('/rules/tree', ruleController.getRuleTree)
router.get('/rules/:id', ruleController.getRule)
router.post('/rules', ruleController.createRule)
router.put('/rules/:id', ruleController.updateRule)
router.delete('/rules/:id', ruleController.deleteRule)

// Tag routes
router.get('/tags', tagController.getTags)
router.get('/tags/:id', tagController.getTag)
router.post('/tags', tagController.createTag)
router.put('/tags/:id', tagController.updateTag)
router.delete('/tags/:id', tagController.deleteTag)

// Page routes
router.get('/pages', pageController.getPages)
router.get('/pages/:id', pageController.getPage)
router.post('/pages', pageController.createPage)
router.put('/pages/:id', pageController.updatePage)
router.delete('/pages/:id', pageController.deletePage)

// User type routes
router.get('/user-types', userTypeController.getUserTypes)
router.get('/user-types/:id', userTypeController.getUserType)
router.post('/user-types', userTypeController.createUserType)
router.put('/user-types/:id', userTypeController.updateUserType)
router.delete('/user-types/:id', userTypeController.deleteUserType)

// Vote routes
router.get('/votes', voteController.getVotes)
router.get('/votes/:id', voteController.getVote)
router.post('/votes', voteController.createVote)
router.put('/votes/:id', voteController.updateVote)
router.delete('/votes/:id', voteController.deleteVote)

// Vote item routes
router.get('/vote-items', voteItemController.getVoteItems)
router.get('/vote-items/:id', voteItemController.getVoteItem)
router.post('/vote-items', voteItemController.createVoteItem)
router.put('/vote-items/:id', voteItemController.updateVoteItem)
router.delete('/vote-items/:id', voteItemController.deleteVoteItem)

// Comment routes
router.get('/comments', commentController.getComments)
router.get('/comments/:id', commentController.getComment)
router.post('/comments', commentController.createComment)
router.put('/comments/:id', commentController.updateComment)
router.delete('/comments/:id', commentController.deleteComment)
router.post('/comments/batch-update-status', commentController.batchUpdateStatus)
router.post('/comments/batch-delete', commentController.batchDeleteComments)
router.get('/comments/stats', commentController.getCommentStats)

// Register access token routes
router.get('/access-token', accessTokenController.getAccessTokens)
router.post('/access-token', accessTokenController.createAccessToken)
router.get('/access-token/:id', accessTokenController.getAccessTokenById)
router.put('/access-token/:id', accessTokenController.updateAccessToken)
router.delete('/access-token/:id', accessTokenController.deleteAccessToken)

// Upload routes
router.post('/upload/image', uploadController.uploadImage)

// 注册system信息接口
router.get('/system/getSystemInfo', getSystemInfo)

// Register dashboard overview route
router.get('/dashboard/overview', getDashboardOverview)

export default router
