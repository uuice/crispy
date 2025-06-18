import { RequestHandler, Router, Request } from 'express'
import * as userController from './users'
import * as adController from './ads'
import * as additionController from './additions'
import * as adItemController from './ad-items'
import * as apiLogController from './api-logs'
import * as articleController from './articles'
import * as categoryController from './categories'
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

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management endpoints
 *   - name: Ads
 *     description: Advertisement management endpoints
 *   - name: AdItems
 *     description: Advertisement item management endpoints
 *   - name: Additions
 *     description: Addition management endpoints
 *   - name: ApiLogs
 *     description: API log management endpoints
 *   - name: Articles
 *     description: Article management endpoints
 *   - name: Categories
 *     description: Category management endpoints
 *   - name: Attrs
 *     description: Attribute management endpoints
 *   - name: Caches
 *     description: Cache management endpoints
 *   - name: Configs
 *     description: Configuration management endpoints
 *   - name: Enums
 *     description: Enumeration management endpoints
 *   - name: Holidays
 *     description: Holiday management endpoints
 *   - name: Jobs
 *     description: Job management endpoints
 *   - name: Keywords
 *     description: Keyword management endpoints
 *   - name: Links
 *     description: Link management endpoints
 *   - name: Menus
 *     description: Menu management endpoints
 *   - name: Notices
 *     description: Notice management endpoints
 *   - name: OperateLogs
 *     description: Operation log management endpoints
 *   - name: Pages
 *     description: Page management endpoints
 *   - name: Roles
 *     description: Role management endpoints
 *   - name: Rules
 *     description: Rule management endpoints
 *   - name: Tags
 *     description: Tag management endpoints
 *   - name: UserTypes
 *     description: User type management endpoints
 *   - name: Votes
 *     description: Vote management endpoints
 *   - name: VoteItems
 *     description: Vote item management endpoints
 */

// User routes
/**
 * @swagger
 * /content/users:
 *   get:
 *     tags: [Users]
 *     summary: Get users list
 *     description: Retrieve paginated list of users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: app_name
 *         required: true
 *         schema:
 *           type: string
 *         description: Application name
 *       - in: query
 *         name: channel
 *         required: true
 *         schema:
 *           type: string
 *         description: Channel name
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Access token
 *     responses:
 *       200:
 *         description: Users list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       401:
 *         description: Invalid or missing access token
 *       400:
 *         description: Missing required parameters
 */
router.get('/users', userController.getUsers)

/**
 * @swagger
 * /content/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID
 *     description: Retrieve a specific user by their ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *       - in: query
 *         name: app_name
 *         required: true
 *         schema:
 *           type: string
 *         description: Application name
 *       - in: query
 *         name: channel
 *         required: true
 *         schema:
 *           type: string
 *         description: Channel name
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Access token
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Invalid or missing access token
 *       400:
 *         description: Missing required parameters
 */
router.get('/users/:id', userController.getUser)

// Ad routes
/**
 * @swagger
 * /content/ads:
 *   get:
 *     tags: [Ads]
 *     summary: Get ads list
 *     description: Retrieve list of advertisements
 *     parameters:
 *       - in: query
 *         name: app_name
 *         required: true
 *         schema:
 *           type: string
 *         description: Application name
 *       - in: query
 *         name: channel
 *         required: true
 *         schema:
 *           type: string
 *         description: Channel name
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Access token
 *     responses:
 *       200:
 *         description: Ads list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Invalid or missing access token
 *       400:
 *         description: Missing required parameters
 */
router.get('/ads', adController.getAds)

/**
 * @swagger
 * /content/ads/{id}:
 *   get:
 *     tags: [Ads]
 *     summary: Get ad by ID
 *     description: Retrieve a specific advertisement by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ad ID
 *       - in: query
 *         name: app_name
 *         required: true
 *         schema:
 *           type: string
 *         description: Application name
 *       - in: query
 *         name: channel
 *         required: true
 *         schema:
 *           type: string
 *         description: Channel name
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Access token
 *     responses:
 *       200:
 *         description: Ad retrieved successfully
 *       404:
 *         description: Ad not found
 *       401:
 *         description: Invalid or missing access token
 *       400:
 *         description: Missing required parameters
 */
router.get('/ads/:id', adController.getAd)

// Ad item routes
/**
 * @swagger
 * /content/ad-items:
 *   get:
 *     tags: [AdItems]
 *     summary: Get ad items list
 *     parameters:
 *       - in: query
 *         name: app_name
 *         required: true
 *         schema:
 *           type: string
 *         description: Application name
 *       - in: query
 *         name: channel
 *         required: true
 *         schema:
 *           type: string
 *         description: Channel name
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Access token
 *     responses:
 *       200:
 *         description: Ad items list retrieved successfully
 *       401:
 *         description: Invalid or missing access token
 *       400:
 *         description: Missing required parameters
 */
router.get('/ad-items', adItemController.getAdItems)

/**
 * @swagger
 * /content/ad-items/{id}:
 *   get:
 *     tags: [AdItems]
 *     summary: Get ad item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ad item ID
 *       - in: query
 *         name: app_name
 *         required: true
 *         schema:
 *           type: string
 *         description: Application name
 *       - in: query
 *         name: channel
 *         required: true
 *         schema:
 *           type: string
 *         description: Channel name
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Access token
 *     responses:
 *       200:
 *         description: Ad item retrieved successfully
 *       404:
 *         description: Ad item not found
 *       401:
 *         description: Invalid or missing access token
 *       400:
 *         description: Missing required parameters
 */
router.get('/ad-items/:id', adItemController.getAdItem)

// Addition routes
/**
 * @swagger
 * /content/additions:
 *   get:
 *     tags: [Additions]
 *     summary: Get additions list
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Additions list retrieved successfully
 */
router.get('/additions', additionController.getAdditions)

/**
 * @swagger
 * /content/additions/{id}:
 *   get:
 *     tags: [Additions]
 *     summary: Get addition by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Addition retrieved successfully
 */
router.get('/additions/:id', additionController.getAddition)

// API log routes
/**
 * @swagger
 * /content/api-logs:
 *   get:
 *     tags: [ApiLogs]
 *     summary: Get API logs list
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: API logs list retrieved successfully
 */
router.get('/api-logs', apiLogController.getApiLogs)

/**
 * @swagger
 * /content/api-logs/{id}:
 *   get:
 *     tags: [ApiLogs]
 *     summary: Get API log by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: API log retrieved successfully
 */
router.get('/api-logs/:id', apiLogController.getApiLog)

// Article routes
/**
 * @swagger
 * /content/articles:
 *   get:
 *     tags: [Articles]
 *     summary: Get articles list
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Articles list retrieved successfully
 */
router.get('/articles', articleController.getArticles)

/**
 * @swagger
 * /content/articles/{id}:
 *   get:
 *     tags: [Articles]
 *     summary: Get article by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Article retrieved successfully
 */
router.get('/articles/:id', articleController.getArticle)

// Category routes
/**
 * @swagger
 * /content/categories:
 *   get:
 *     tags: [Categories]
 *     summary: Get categories list
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Categories list retrieved successfully
 */
router.get('/categories', categoryController.getCategories)

/**
 * @swagger
 * /content/categories/tree:
 *   get:
 *     tags: [Categories]
 *     summary: Get categories tree
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Categories tree retrieved successfully
 */
router.get('/categories/tree', categoryController.getCategoryTree)

/**
 * @swagger
 * /content/categories/{id}:
 *   get:
 *     tags: [Categories]
 *     summary: Get category by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 */
router.get('/categories/:id', categoryController.getCategory)

// Attrs routes
/**
 * @swagger
 * /content/attrs:
 *   get:
 *     tags: [Attrs]
 *     summary: Get attributes list
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Attributes list retrieved successfully
 */
router.get('/attrs', attrController.getAttrs)

/**
 * @swagger
 * /content/attrs/{id}:
 *   get:
 *     tags: [Attrs]
 *     summary: Get attribute by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Attribute retrieved successfully
 */
router.get('/attrs/:id', attrController.getAttr)

// Caches routes
/**
 * @swagger
 * /content/caches:
 *   get:
 *     tags: [Caches]
 *     summary: Get caches list
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Caches list retrieved successfully
 */
router.get('/caches', cacheController.getCaches)

/**
 * @swagger
 * /content/caches/{id}:
 *   get:
 *     tags: [Caches]
 *     summary: Get cache by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cache retrieved successfully
 */
router.get('/caches/:id', cacheController.getCache)

// Configs routes
/**
 * @swagger
 * /content/configs:
 *   get:
 *     tags: [Configs]
 *     summary: Get configs list
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Configs list retrieved successfully
 */
router.get('/configs', configController.getConfigs)

/**
 * @swagger
 * /content/configs/{id}:
 *   get:
 *     tags: [Configs]
 *     summary: Get config by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Config retrieved successfully
 */
router.get('/configs/:id', configController.getConfig)

// Enums routes
/**
 * @swagger
 * /content/enums:
 *   get:
 *     tags: [Enums]
 *     summary: Get enums list
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Enums list retrieved successfully
 */
router.get('/enums', enumController.getEnums)

/**
 * @swagger
 * /content/enums/{id}:
 *   get:
 *     tags: [Enums]
 *     summary: Get enum by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Enum retrieved successfully
 */
router.get('/enums/:id', enumController.getEnum)

// Holidays routes
/**
 * @swagger
 * /content/holidays:
 *   get:
 *     tags: [Holidays]
 *     summary: Get holidays list
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Holidays list retrieved successfully
 */
router.get('/holidays', holidayController.getHolidays)

/**
 * @swagger
 * /content/holidays/{id}:
 *   get:
 *     tags: [Holidays]
 *     summary: Get holiday by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Holiday retrieved successfully
 */
router.get('/holidays/:id', holidayController.getHoliday)

// Job routes
/**
 * @swagger
 * /content/jobs:
 *   get:
 *     tags: [Jobs]
 *     summary: Get jobs list
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Jobs list retrieved successfully
 */
router.get('/jobs', jobController.getJobs)

/**
 * @swagger
 * /content/jobs/{id}:
 *   get:
 *     tags: [Jobs]
 *     summary: Get job by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Job retrieved successfully
 */
router.get('/jobs/:id', jobController.getJob)

// Keyword routes
/**
 * @swagger
 * /content/keywords:
 *   get:
 *     tags: [Keywords]
 *     summary: Get keywords list
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Keywords list retrieved successfully
 */
router.get('/keywords', keywordController.getKeywords)

/**
 * @swagger
 * /content/keywords/{id}:
 *   get:
 *     tags: [Keywords]
 *     summary: Get keyword by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Keyword retrieved successfully
 */
router.get('/keywords/:id', keywordController.getKeyword)

// Link routes
/**
 * @swagger
 * /content/links:
 *   get:
 *     tags: [Links]
 *     summary: Get links list
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Links list retrieved successfully
 */
router.get('/links', linkController.getLinks)

/**
 * @swagger
 * /content/links/{id}:
 *   get:
 *     tags: [Links]
 *     summary: Get link by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Link retrieved successfully
 */
router.get('/links/:id', linkController.getLink)

// Menu routes
/**
 * @swagger
 * /content/menus:
 *   get:
 *     tags: [Menus]
 *     summary: Get menus list
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Menus list retrieved successfully
 */
router.get('/menus', menuController.getMenus)

/**
 * @swagger
 * /content/menus/tree:
 *   get:
 *     tags: [Menus]
 *     summary: Get menus tree
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Menus tree retrieved successfully
 */
router.get('/menus/tree', menuController.getMenuTree)

/**
 * @swagger
 * /content/menus/{id}:
 *   get:
 *     tags: [Menus]
 *     summary: Get menu by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Menu retrieved successfully
 */
router.get('/menus/:id', menuController.getMenu)

// Notice routes
/**
 * @swagger
 * /content/notices:
 *   get:
 *     tags: [Notices]
 *     summary: Get notices list
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notices list retrieved successfully
 */
router.get('/notices', noticeController.getNotices)

/**
 * @swagger
 * /content/notices/{id}:
 *   get:
 *     tags: [Notices]
 *     summary: Get notice by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notice retrieved successfully
 */
router.get('/notices/:id', noticeController.getNotice)

// Operate log routes
/**
 * @swagger
 * /content/operate-logs:
 *   get:
 *     tags: [OperateLogs]
 *     summary: Get operate logs list
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Operate logs list retrieved successfully
 */
router.get('/operate-logs', operateLogController.getOperateLogs)

/**
 * @swagger
 * /content/operate-logs/{id}:
 *   get:
 *     tags: [OperateLogs]
 *     summary: Get operate log by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Operate log retrieved successfully
 */
router.get('/operate-logs/:id', operateLogController.getOperateLog)

// Role routes
/**
 * @swagger
 * /content/roles:
 *   get:
 *     tags: [Roles]
 *     summary: Get roles list
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Roles list retrieved successfully
 */
router.get('/roles', roleController.getRoles)

/**
 * @swagger
 * /content/roles/{id}:
 *   get:
 *     tags: [Roles]
 *     summary: Get role by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Role retrieved successfully
 */
router.get('/roles/:id', roleController.getRole)

// Rule routes
/**
 * @swagger
 * /content/rules:
 *   get:
 *     tags: [Rules]
 *     summary: Get rules list
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rules list retrieved successfully
 */
router.get('/rules', ruleController.getRules)

/**
 * @swagger
 * /content/rules/tree:
 *   get:
 *     tags: [Rules]
 *     summary: Get rules tree
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rules tree retrieved successfully
 */
router.get('/rules/tree', ruleController.getRuleTree)

/**
 * @swagger
 * /content/rules/{id}:
 *   get:
 *     tags: [Rules]
 *     summary: Get rule by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Rule retrieved successfully
 */
router.get('/rules/:id', ruleController.getRule)

// Tag routes
/**
 * @swagger
 * /content/tags:
 *   get:
 *     tags: [Tags]
 *     summary: Get tags list
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tags list retrieved successfully
 */
router.get('/tags', tagController.getTags)

/**
 * @swagger
 * /content/tags/{id}:
 *   get:
 *     tags: [Tags]
 *     summary: Get tag by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tag retrieved successfully
 */
router.get('/tags/:id', tagController.getTag)

// Page routes
/**
 * @swagger
 * /content/pages:
 *   get:
 *     tags: [Pages]
 *     summary: Get pages list
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pages list retrieved successfully
 */
router.get('/pages', pageController.getPages)

/**
 * @swagger
 * /content/pages/{id}:
 *   get:
 *     tags: [Pages]
 *     summary: Get page by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Page retrieved successfully
 */
router.get('/pages/:id', pageController.getPage)

// User type routes
/**
 * @swagger
 * /content/user-types:
 *   get:
 *     tags: [UserTypes]
 *     summary: Get user types list
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User types list retrieved successfully
 */
router.get('/user-types', userTypeController.getUserTypes)

/**
 * @swagger
 * /content/user-types/{id}:
 *   get:
 *     tags: [UserTypes]
 *     summary: Get user type by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User type retrieved successfully
 */
router.get('/user-types/:id', userTypeController.getUserType)

// Vote routes
/**
 * @swagger
 * /content/votes:
 *   get:
 *     tags: [Votes]
 *     summary: Get votes list
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Votes list retrieved successfully
 */
router.get('/votes', voteController.getVotes)

/**
 * @swagger
 * /content/votes/{id}:
 *   get:
 *     tags: [Votes]
 *     summary: Get vote by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vote retrieved successfully
 */
router.get('/votes/:id', voteController.getVote)

// Vote item routes
/**
 * @swagger
 * /content/vote-items:
 *   get:
 *     tags: [VoteItems]
 *     summary: Get vote items list
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vote items list retrieved successfully
 */
router.get('/vote-items', voteItemController.getVoteItems)

/**
 * @swagger
 * /content/vote-items/{id}:
 *   get:
 *     tags: [VoteItems]
 *     summary: Get vote item by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vote item retrieved successfully
 */
router.get('/vote-items/:id', voteItemController.getVoteItem)

// Register access token routes
/**
 * @swagger
 * /admin/access-token:
 *   get:
 *     tags: [AccessTokens]
 *     summary: Get access tokens list
 *     description: Retrieve paginated list of access tokens with optional filters
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: app_name
 *         schema:
 *           type: string
 *         description: Filter by app name
 *       - in: query
 *         name: channel
 *         schema:
 *           type: string
 *         description: Filter by channel
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *         description: Filter by status
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: Filter by user ID
 *     responses:
 *       200:
 *         description: Access tokens list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           app_name:
 *                             type: string
 *                           channel:
 *                             type: string
 *                           user_id:
 *                             type: integer
 *                           status:
 *                             type: integer
 *                           create_time:
 *                             type: integer
 *                           update_time:
 *                             type: integer
 *                     total:
 *                       type: integer
 */
router.get('/access-token', accessTokenController.getAccessTokens)

/**
 * @swagger
 * /admin/access-token/{id}:
 *   get:
 *     tags: [AccessTokens]
 *     summary: Get access token by ID
 *     description: Retrieve a specific access token by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Access token ID
 *     responses:
 *       200:
 *         description: Access token retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     app_name:
 *                       type: string
 *                     channel:
 *                       type: string
 *                     user_id:
 *                       type: integer
 *                     status:
 *                       type: integer
 *                     create_time:
 *                       type: integer
 *                     update_time:
 *                       type: integer
 *       404:
 *         description: Access token not found
 */
router.get('/access-token/:id', accessTokenController.getAccessToken)

/**
 * @swagger
 * /content/access-token/check:
 *   post:
 *     tags: [AccessTokens]
 *     summary: Check access token validity
 *     description: Verify if an access token is valid for the given app and channel
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - app_name
 *               - channel
 *               - token
 *             properties:
 *               app_name:
 *                 type: string
 *                 description: Application name
 *               channel:
 *                 type: string
 *                 description: Channel name
 *               token:
 *                 type: string
 *                 description: Access token to verify
 *     responses:
 *       200:
 *         description: Token validation successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     valid:
 *                       type: boolean
 *                       example: true
 *                 message:
 *                   type: string
 *                   example: Access token is valid
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Invalid access token
 */
router.post('/access-token/check', accessTokenController.checkAccessToken)

export default router
