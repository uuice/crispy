import { RequestHandler, Router, Request } from 'express'
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
import { AccessTokenService } from '../../services/accessToken.Service'
import { accessTokenController } from './access-token'
import { error } from '../../utils/response'

// Define token info interface
interface TokenInfo {
  app_name: string
  channel: string
}

// Extend Request type with token info
interface RequestWithToken extends Request {
  tokenInfo?: TokenInfo
}

const router = Router()

// Initialize service
const accessTokenService = new AccessTokenService()

// Create authentication middleware
const authMiddleware: RequestHandler = async (req: Request, res, next) => {
  console.log(req.path)
  if (req.path === '/login' || req.path === '/login/') {
    next()
    return
  }

  // Get token from header
  const token = req.headers['x-access-token'] as string
  if (!token) {
    error(res, 'Access token is required', 401)
    return
  }

  try {
    // Get app_name and channel from headers
    const { app_name, channel } = req.headers
    if (!app_name || !channel) {
      error(res, 'App name and channel are required', 400)
      return
    }

    // Validate token
    const isValid = await accessTokenService.checkToken(
      app_name as string,
      channel as string,
      token
    )

    if (!isValid) {
      error(res, 'Invalid access token', 401)
      return
    }

    // Add token info to request for later use
    ;(req as RequestWithToken).tokenInfo = {
      app_name: app_name as string,
      channel: channel as string
    }
    next()
  } catch (err) {
    console.error('Error validating access token:', err)
    error(res, 'Internal server error', 500)
  }
}

// Apply authentication middleware
router.use(authMiddleware)

// User routes
router.get('/users', userController.getUsers)
router.get('/users/:id', userController.getUser)

// Ad routes
router.get('/ads', adController.getAds)
router.get('/ads/:id', adController.getAd)

// Ad item routes
router.get('/ad-items', adItemController.getAdItems)
router.get('/ad-items/:id', adItemController.getAdItem)

// Addition routes
router.get('/additions', additionController.getAdditions)
router.get('/additions/:id', additionController.getAddition)

// API log routes
router.get('/api-logs', apiLogController.getApiLogs)
router.get('/api-logs/:id', apiLogController.getApiLog)

// Article routes
router.get('/articles', articleController.getArticles)
router.get('/articles/:id', articleController.getArticle)

// Category routes
router.get('/categories', categoryController.getCategories)
router.get('/categories/tree', categoryController.getCategoryTree)
router.get('/categories/:id', categoryController.getCategory)

// Attrs routes
router.get('/attrs', attrController.getAttrs)
router.get('/attrs/:id', attrController.getAttr)

// Caches routes
router.get('/caches', cacheController.getCaches)
router.get('/caches/:id', cacheController.getCache)

// Configs routes
router.get('/configs', configController.getConfigs)
router.get('/configs/alias/:alias', configController.getConfigByAlias)
router.get('/configs/:id', configController.getConfig)

// Enums routes
router.get('/enums', enumController.getEnums)
router.get('/enums/:id', enumController.getEnum)

// Holidays routes
router.get('/holidays', holidayController.getHolidays)
router.get('/holidays/:id', holidayController.getHoliday)

// Job routes
router.get('/jobs', jobController.getJobs)
router.get('/jobs/:id', jobController.getJob)

// Keyword routes
router.get('/keywords', keywordController.getKeywords)
router.get('/keywords/:id', keywordController.getKeyword)

// Link routes
router.get('/links', linkController.getLinks)
router.get('/links/:id', linkController.getLink)

// Menu routes
router.get('/menus', menuController.getMenus)
router.get('/menus/tree', menuController.getMenuTree)
router.get('/menus/:id', menuController.getMenu)

// Notice routes
router.get('/notices', noticeController.getNotices)
router.get('/notices/:id', noticeController.getNotice)

// Operate log routes
router.get('/operate-logs', operateLogController.getOperateLogs)
router.get('/operate-logs/:id', operateLogController.getOperateLog)

// Role routes
router.get('/roles', roleController.getRoles)
router.get('/roles/:id', roleController.getRole)

// Rule routes
router.get('/rules', ruleController.getRules)
router.get('/rules/tree', ruleController.getRuleTree)
router.get('/rules/:id', ruleController.getRule)

// Tag routes
router.get('/tags', tagController.getTags)
router.get('/tags/:id', tagController.getTag)

// Page routes
router.get('/pages', pageController.getPages)
router.get('/pages/:id', pageController.getPage)

// User type routes
router.get('/user-types', userTypeController.getUserTypes)
router.get('/user-types/:id', userTypeController.getUserType)

// Vote routes
router.get('/votes', voteController.getVotes)
router.get('/votes/:id', voteController.getVote)

// Vote item routes
router.get('/vote-items', voteItemController.getVoteItems)
router.get('/vote-items/:id', voteItemController.getVoteItem)

// Register access token routes
router.get('/access-token', accessTokenController.getAccessTokens)
router.get('/access-token/:id', accessTokenController.getAccessToken)
router.post('/access-token/check', accessTokenController.checkAccessToken)

export default router
