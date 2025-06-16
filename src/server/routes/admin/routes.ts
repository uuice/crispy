import { RequestHandler, Router } from 'express'
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
import { jwtMiddleware } from '@src/server/middleware'
import { accessTokenController } from './access-token'

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

// Apply authentication middleware
router.use(authMiddleware)

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication endpoints
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
 * /admin/login:
 *   post:
 *     tags: [Authentication]
 *     summary: User login
 *     description: Authenticate user and return JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', userController.login)

/**
 * @swagger
 * /admin/logout:
 *   post:
 *     tags: [Authentication]
 *     summary: User logout
 *     description: Logout user and invalidate token
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logout successful
 */
router.post('/logout', jwtMiddleware, userController.logout)

/**
 * @swagger
 * /admin/users:
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
 */
router.get('/users', jwtMiddleware, userController.getUsers)

/**
 * @swagger
 * /admin/users/{id}:
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
 */
router.get('/users/:id', jwtMiddleware, userController.getUser)

/**
 * @swagger
 * /admin/users:
 *   post:
 *     tags: [Users]
 *     summary: Create new user
 *     description: Create a new user account
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_name
 *               - password
 *             properties:
 *               user_name:
 *                 type: string
 *                 description: Username
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: Password (minimum 6 characters)
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email
 *               phone:
 *                 type: string
 *                 description: User phone number
 *               real_name:
 *                 type: string
 *                 description: Real name
 *               nick_name:
 *                 type: string
 *                 description: Nickname
 *               avatar_url:
 *                 type: string
 *                 description: Avatar URL
 *               role_id:
 *                 type: integer
 *                 description: Role ID
 *               type_id:
 *                 type: integer
 *                 description: User type ID
 *               status:
 *                 type: integer
 *                 default: 10
 *                 description: User status
 *               is_admin:
 *                 type: integer
 *                 default: -10
 *                 description: Admin flag
 *               is_super_admin:
 *                 type: integer
 *                 default: -10
 *                 description: Super admin flag
 *               is_black:
 *                 type: integer
 *                 default: -10
 *                 description: Blacklist flag
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/users', jwtMiddleware, userController.createUser)

/**
 * @swagger
 * /admin/users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update user
 *     description: Update an existing user's information
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_name:
 *                 type: string
 *                 description: Username
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: Password (minimum 6 characters)
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email
 *               phone:
 *                 type: string
 *                 description: User phone number
 *               real_name:
 *                 type: string
 *                 description: Real name
 *               nick_name:
 *                 type: string
 *                 description: Nickname
 *               avatar_url:
 *                 type: string
 *                 description: Avatar URL
 *               role_id:
 *                 type: integer
 *                 description: Role ID
 *               type_id:
 *                 type: integer
 *                 description: User type ID
 *               status:
 *                 type: integer
 *                 description: User status
 *               is_admin:
 *                 type: integer
 *                 description: Admin flag
 *               is_super_admin:
 *                 type: integer
 *                 description: Super admin flag
 *               is_black:
 *                 type: integer
 *                 description: Blacklist flag
 *     responses:
 *       200:
 *         description: User updated successfully
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
 */
router.put('/users/:id', jwtMiddleware, userController.updateUser)

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete user
 *     description: Soft delete a user (logical deletion)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/users/:id', jwtMiddleware, userController.deleteUser)

/**
 * @swagger
 * /admin/users/{id}/reset-password:
 *   post:
 *     tags: [Users]
 *     summary: Reset user password
 *     description: Reset password for a specific user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: New password (minimum 6 characters)
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password reset successfully
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/users/:id/reset-password', jwtMiddleware, userController.resetPassword)

// Ad routes
/**
 * @swagger
 * /admin/ads:
 *   get:
 *     tags: [Ads]
 *     summary: Get ads list
 *     description: Retrieve list of advertisements
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ads list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/ads', adController.getAds)

/**
 * @swagger
 * /admin/ads/{id}:
 *   get:
 *     tags: [Ads]
 *     summary: Get ad by ID
 *     description: Retrieve a specific advertisement by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ad ID
 *     responses:
 *       200:
 *         description: Ad retrieved successfully
 *       404:
 *         description: Ad not found
 */
router.get('/ads/:id', adController.getAd)

/**
 * @swagger
 * /admin/ads:
 *   post:
 *     tags: [Ads]
 *     summary: Create new ad
 *     description: Create a new advertisement
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Ad created successfully
 *       400:
 *         description: Invalid input data
 */
router.post('/ads', adController.createAd)

/**
 * @swagger
 * /admin/ads/{id}:
 *   put:
 *     tags: [Ads]
 *     summary: Update ad
 *     description: Update an existing advertisement
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ad ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Ad updated successfully
 *       404:
 *         description: Ad not found
 */
router.put('/ads/:id', adController.updateAd)

/**
 * @swagger
 * /admin/ads/{id}:
 *   delete:
 *     tags: [Ads]
 *     summary: Delete ad
 *     description: Delete an advertisement
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ad ID
 *     responses:
 *       200:
 *         description: Ad deleted successfully
 *       404:
 *         description: Ad not found
 */
router.delete('/ads/:id', adController.deleteAd)

// Ad item routes
/**
 * @swagger
 * /admin/ad-items:
 *   get:
 *     tags: [AdItems]
 *     summary: Get ad items list
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ad items list retrieved successfully
 */
router.get('/ad-items', adItemController.getAdItems)

/**
 * @swagger
 * /admin/ad-items/{id}:
 *   get:
 *     tags: [AdItems]
 *     summary: Get ad item by ID
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
 *         description: Ad item retrieved successfully
 */
router.get('/ad-items/:id', adItemController.getAdItem)

/**
 * @swagger
 * /admin/ad-items:
 *   post:
 *     tags: [AdItems]
 *     summary: Create new ad item
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Ad item created successfully
 */
router.post('/ad-items', adItemController.createAdItem)

/**
 * @swagger
 * /admin/ad-items/{id}:
 *   put:
 *     tags: [AdItems]
 *     summary: Update ad item
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
 *         description: Ad item updated successfully
 */
router.put('/ad-items/:id', adItemController.updateAdItem)

/**
 * @swagger
 * /admin/ad-items/{id}:
 *   delete:
 *     tags: [AdItems]
 *     summary: Delete ad item
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
 *         description: Ad item deleted successfully
 */
router.delete('/ad-items/:id', adItemController.deleteAdItem)

// Addition routes
/**
 * @swagger
 * /admin/additions:
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
 * /admin/additions/{id}:
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

/**
 * @swagger
 * /admin/additions:
 *   post:
 *     tags: [Additions]
 *     summary: Create new addition
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Addition created successfully
 */
router.post('/additions', additionController.createAddition)

/**
 * @swagger
 * /admin/additions/{id}:
 *   put:
 *     tags: [Additions]
 *     summary: Update addition
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
 *         description: Addition updated successfully
 */
router.put('/additions/:id', additionController.updateAddition)

/**
 * @swagger
 * /admin/additions/{id}:
 *   delete:
 *     tags: [Additions]
 *     summary: Delete addition
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
 *         description: Addition deleted successfully
 */
router.delete('/additions/:id', additionController.deleteAddition)

// API log routes
/**
 * @swagger
 * /admin/api-logs:
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
 * /admin/api-logs/{id}:
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

/**
 * @swagger
 * /admin/api-logs:
 *   post:
 *     tags: [ApiLogs]
 *     summary: Create new API log
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: API log created successfully
 */
router.post('/api-logs', apiLogController.createApiLog)

/**
 * @swagger
 * /admin/api-logs/{id}:
 *   put:
 *     tags: [ApiLogs]
 *     summary: Update API log
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
 *         description: API log updated successfully
 */
router.put('/api-logs/:id', apiLogController.updateApiLog)

/**
 * @swagger
 * /admin/api-logs/{id}:
 *   delete:
 *     tags: [ApiLogs]
 *     summary: Delete API log
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
 *         description: API log deleted successfully
 */
router.delete('/api-logs/:id', apiLogController.deleteApiLog)

// Article routes
/**
 * @swagger
 * /admin/articles:
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
 * /admin/articles/{id}:
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

/**
 * @swagger
 * /admin/articles:
 *   post:
 *     tags: [Articles]
 *     summary: Create new article
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Article created successfully
 */
router.post('/articles', articleController.createArticle)

/**
 * @swagger
 * /admin/articles/{id}:
 *   put:
 *     tags: [Articles]
 *     summary: Update article
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
 *         description: Article updated successfully
 */
router.put('/articles/:id', articleController.updateArticle)

/**
 * @swagger
 * /admin/articles/{id}:
 *   delete:
 *     tags: [Articles]
 *     summary: Delete article
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
 *         description: Article deleted successfully
 */
router.delete('/articles/:id', articleController.deleteArticle)

// Category routes
/**
 * @swagger
 * /admin/categories:
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
 * /admin/categories/tree:
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
 * /admin/categories/{id}:
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

/**
 * @swagger
 * /admin/categories:
 *   post:
 *     tags: [Categories]
 *     summary: Create new category
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Category created successfully
 */
router.post('/categories', categoryController.createCategory)

/**
 * @swagger
 * /admin/categories/{id}:
 *   put:
 *     tags: [Categories]
 *     summary: Update category
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
 *         description: Category updated successfully
 */
router.put('/categories/:id', categoryController.updateCategory)

/**
 * @swagger
 * /admin/categories/{id}:
 *   delete:
 *     tags: [Categories]
 *     summary: Delete category
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
 *         description: Category deleted successfully
 */
router.delete('/categories/:id', categoryController.deleteCategory)

// Attrs routes
/**
 * @swagger
 * /admin/attrs:
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
 * /admin/attrs/{id}:
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

/**
 * @swagger
 * /admin/attrs:
 *   post:
 *     tags: [Attrs]
 *     summary: Create new attribute
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Attribute created successfully
 */
router.post('/attrs', attrController.createAttr)

/**
 * @swagger
 * /admin/attrs/{id}:
 *   put:
 *     tags: [Attrs]
 *     summary: Update attribute
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
 *         description: Attribute updated successfully
 */
router.put('/attrs/:id', attrController.updateAttr)

/**
 * @swagger
 * /admin/attrs/{id}:
 *   delete:
 *     tags: [Attrs]
 *     summary: Delete attribute
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
 *         description: Attribute deleted successfully
 */
router.delete('/attrs/:id', attrController.deleteAttr)

// Caches routes
/**
 * @swagger
 * /admin/caches:
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
 * /admin/caches/{id}:
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

/**
 * @swagger
 * /admin/caches:
 *   post:
 *     tags: [Caches]
 *     summary: Create new cache
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Cache created successfully
 */
router.post('/caches', cacheController.createCache)

/**
 * @swagger
 * /admin/caches/{id}:
 *   put:
 *     tags: [Caches]
 *     summary: Update cache
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
 *         description: Cache updated successfully
 */
router.put('/caches/:id', cacheController.updateCache)

/**
 * @swagger
 * /admin/caches/{id}:
 *   delete:
 *     tags: [Caches]
 *     summary: Delete cache
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
 *         description: Cache deleted successfully
 */
router.delete('/caches/:id', cacheController.deleteCache)

// Configs routes
/**
 * @swagger
 * /admin/configs:
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
 * /admin/configs/{id}:
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

/**
 * @swagger
 * /admin/configs:
 *   post:
 *     tags: [Configs]
 *     summary: Create new config
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Config created successfully
 */
router.post('/configs', configController.createConfig)

/**
 * @swagger
 * /admin/configs/{id}:
 *   put:
 *     tags: [Configs]
 *     summary: Update config
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
 *         description: Config updated successfully
 */
router.put('/configs/:id', configController.updateConfig)

/**
 * @swagger
 * /admin/configs/{id}:
 *   delete:
 *     tags: [Configs]
 *     summary: Delete config
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
 *         description: Config deleted successfully
 */
router.delete('/configs/:id', configController.deleteConfig)

// Enums routes
/**
 * @swagger
 * /admin/enums:
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
 * /admin/enums/{id}:
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

/**
 * @swagger
 * /admin/enums:
 *   post:
 *     tags: [Enums]
 *     summary: Create new enum
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Enum created successfully
 */
router.post('/enums', enumController.createEnum)

/**
 * @swagger
 * /admin/enums/{id}:
 *   put:
 *     tags: [Enums]
 *     summary: Update enum
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
 *         description: Enum updated successfully
 */
router.put('/enums/:id', enumController.updateEnum)

/**
 * @swagger
 * /admin/enums/{id}:
 *   delete:
 *     tags: [Enums]
 *     summary: Delete enum
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
 *         description: Enum deleted successfully
 */
router.delete('/enums/:id', enumController.deleteEnum)

// Holidays routes
/**
 * @swagger
 * /admin/holidays:
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
 * /admin/holidays/{id}:
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

/**
 * @swagger
 * /admin/holidays:
 *   post:
 *     tags: [Holidays]
 *     summary: Create new holiday
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Holiday created successfully
 */
router.post('/holidays', holidayController.createHoliday)

/**
 * @swagger
 * /admin/holidays/{id}:
 *   put:
 *     tags: [Holidays]
 *     summary: Update holiday
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
 *         description: Holiday updated successfully
 */
router.put('/holidays/:id', holidayController.updateHoliday)

/**
 * @swagger
 * /admin/holidays/{id}:
 *   delete:
 *     tags: [Holidays]
 *     summary: Delete holiday
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
 *         description: Holiday deleted successfully
 */
router.delete('/holidays/:id', holidayController.deleteHoliday)

// Job routes
/**
 * @swagger
 * /admin/jobs:
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
 * /admin/jobs/{id}:
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

/**
 * @swagger
 * /admin/jobs:
 *   post:
 *     tags: [Jobs]
 *     summary: Create new job
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Job created successfully
 */
router.post('/jobs', jobController.createJob)

/**
 * @swagger
 * /admin/jobs/{id}:
 *   put:
 *     tags: [Jobs]
 *     summary: Update job
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
 *         description: Job updated successfully
 */
router.put('/jobs/:id', jobController.updateJob)

/**
 * @swagger
 * /admin/jobs/{id}:
 *   delete:
 *     tags: [Jobs]
 *     summary: Delete job
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
 *         description: Job deleted successfully
 */
router.delete('/jobs/:id', jobController.deleteJob)

// Keyword routes
/**
 * @swagger
 * /admin/keywords:
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
 * /admin/keywords/{id}:
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

/**
 * @swagger
 * /admin/keywords:
 *   post:
 *     tags: [Keywords]
 *     summary: Create new keyword
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Keyword created successfully
 */
router.post('/keywords', keywordController.createKeyword)

/**
 * @swagger
 * /admin/keywords/{id}:
 *   put:
 *     tags: [Keywords]
 *     summary: Update keyword
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
 *         description: Keyword updated successfully
 */
router.put('/keywords/:id', keywordController.updateKeyword)

/**
 * @swagger
 * /admin/keywords/{id}:
 *   delete:
 *     tags: [Keywords]
 *     summary: Delete keyword
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
 *         description: Keyword deleted successfully
 */
router.delete('/keywords/:id', keywordController.deleteKeyword)

// Link routes
/**
 * @swagger
 * /admin/links:
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
 * /admin/links/{id}:
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

/**
 * @swagger
 * /admin/links:
 *   post:
 *     tags: [Links]
 *     summary: Create new link
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Link created successfully
 */
router.post('/links', linkController.createLink)

/**
 * @swagger
 * /admin/links/{id}:
 *   put:
 *     tags: [Links]
 *     summary: Update link
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
 *         description: Link updated successfully
 */
router.put('/links/:id', linkController.updateLink)

/**
 * @swagger
 * /admin/links/{id}:
 *   delete:
 *     tags: [Links]
 *     summary: Delete link
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
 *         description: Link deleted successfully
 */
router.delete('/links/:id', linkController.deleteLink)

// Menu routes
/**
 * @swagger
 * /admin/menus:
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
 * /admin/menus/tree:
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
 * /admin/menus/{id}:
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

/**
 * @swagger
 * /admin/menus:
 *   post:
 *     tags: [Menus]
 *     summary: Create new menu
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Menu created successfully
 */
router.post('/menus', menuController.createMenu)

/**
 * @swagger
 * /admin/menus/{id}:
 *   put:
 *     tags: [Menus]
 *     summary: Update menu
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
 *         description: Menu updated successfully
 */
router.put('/menus/:id', menuController.updateMenu)

/**
 * @swagger
 * /admin/menus/{id}:
 *   delete:
 *     tags: [Menus]
 *     summary: Delete menu
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
 *         description: Menu deleted successfully
 */
router.delete('/menus/:id', menuController.deleteMenu)

// Notice routes
/**
 * @swagger
 * /admin/notices:
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
 * /admin/notices/{id}:
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

/**
 * @swagger
 * /admin/notices:
 *   post:
 *     tags: [Notices]
 *     summary: Create new notice
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Notice created successfully
 */
router.post('/notices', noticeController.createNotice)

/**
 * @swagger
 * /admin/notices/{id}:
 *   put:
 *     tags: [Notices]
 *     summary: Update notice
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
 *         description: Notice updated successfully
 */
router.put('/notices/:id', noticeController.updateNotice)

/**
 * @swagger
 * /admin/notices/{id}:
 *   delete:
 *     tags: [Notices]
 *     summary: Delete notice
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
 *         description: Notice deleted successfully
 */
router.delete('/notices/:id', noticeController.deleteNotice)

// Operate log routes
/**
 * @swagger
 * /admin/operate-logs:
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
 * /admin/operate-logs/{id}:
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

/**
 * @swagger
 * /admin/operate-logs:
 *   post:
 *     tags: [OperateLogs]
 *     summary: Create new operate log
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Operate log created successfully
 */
router.post('/operate-logs', operateLogController.createOperateLog)

/**
 * @swagger
 * /admin/operate-logs/{id}:
 *   put:
 *     tags: [OperateLogs]
 *     summary: Update operate log
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
 *         description: Operate log updated successfully
 */
router.put('/operate-logs/:id', operateLogController.updateOperateLog)

/**
 * @swagger
 * /admin/operate-logs/{id}:
 *   delete:
 *     tags: [OperateLogs]
 *     summary: Delete operate log
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
 *         description: Operate log deleted successfully
 */
router.delete('/operate-logs/:id', operateLogController.deleteOperateLog)

// Role routes
/**
 * @swagger
 * /admin/roles:
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
 * /admin/roles/{id}:
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

/**
 * @swagger
 * /admin/roles:
 *   post:
 *     tags: [Roles]
 *     summary: Create new role
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Role created successfully
 */
router.post('/roles', roleController.createRole)

/**
 * @swagger
 * /admin/roles/{id}:
 *   put:
 *     tags: [Roles]
 *     summary: Update role
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
 *         description: Role updated successfully
 */
router.put('/roles/:id', roleController.updateRole)

/**
 * @swagger
 * /admin/roles/{id}:
 *   delete:
 *     tags: [Roles]
 *     summary: Delete role
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
 *         description: Role deleted successfully
 */
router.delete('/roles/:id', roleController.deleteRole)

// Rule routes
/**
 * @swagger
 * /admin/rules:
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
 * /admin/rules/tree:
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
 * /admin/rules/{id}:
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

/**
 * @swagger
 * /admin/rules:
 *   post:
 *     tags: [Rules]
 *     summary: Create new rule
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Rule created successfully
 */
router.post('/rules', ruleController.createRule)

/**
 * @swagger
 * /admin/rules/{id}:
 *   put:
 *     tags: [Rules]
 *     summary: Update rule
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
 *         description: Rule updated successfully
 */
router.put('/rules/:id', ruleController.updateRule)

/**
 * @swagger
 * /admin/rules/{id}:
 *   delete:
 *     tags: [Rules]
 *     summary: Delete rule
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
 *         description: Rule deleted successfully
 */
router.delete('/rules/:id', ruleController.deleteRule)

// Tag routes
/**
 * @swagger
 * /admin/tags:
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
 * /admin/tags/{id}:
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

/**
 * @swagger
 * /admin/tags:
 *   post:
 *     tags: [Tags]
 *     summary: Create new tag
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Tag created successfully
 */
router.post('/tags', tagController.createTag)

/**
 * @swagger
 * /admin/tags/{id}:
 *   put:
 *     tags: [Tags]
 *     summary: Update tag
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
 *         description: Tag updated successfully
 */
router.put('/tags/:id', tagController.updateTag)

/**
 * @swagger
 * /admin/tags/{id}:
 *   delete:
 *     tags: [Tags]
 *     summary: Delete tag
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
 *         description: Tag deleted successfully
 */
router.delete('/tags/:id', tagController.deleteTag)

// Page routes
/**
 * @swagger
 * /admin/pages:
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
 * /admin/pages/{id}:
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

/**
 * @swagger
 * /admin/pages:
 *   post:
 *     tags: [Pages]
 *     summary: Create new page
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Page created successfully
 */
router.post('/pages', pageController.createPage)

/**
 * @swagger
 * /admin/pages/{id}:
 *   put:
 *     tags: [Pages]
 *     summary: Update page
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
 *         description: Page updated successfully
 */
router.put('/pages/:id', pageController.updatePage)

/**
 * @swagger
 * /admin/pages/{id}:
 *   delete:
 *     tags: [Pages]
 *     summary: Delete page
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
 *         description: Page deleted successfully
 */
router.delete('/pages/:id', pageController.deletePage)

// User type routes
/**
 * @swagger
 * /admin/user-types:
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
 * /admin/user-types/{id}:
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

/**
 * @swagger
 * /admin/user-types:
 *   post:
 *     tags: [UserTypes]
 *     summary: Create new user type
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: User type created successfully
 */
router.post('/user-types', userTypeController.createUserType)

/**
 * @swagger
 * /admin/user-types/{id}:
 *   put:
 *     tags: [UserTypes]
 *     summary: Update user type
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
 *         description: User type updated successfully
 */
router.put('/user-types/:id', userTypeController.updateUserType)

/**
 * @swagger
 * /admin/user-types/{id}:
 *   delete:
 *     tags: [UserTypes]
 *     summary: Delete user type
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
 *         description: User type deleted successfully
 */
router.delete('/user-types/:id', userTypeController.deleteUserType)

// Vote routes
/**
 * @swagger
 * /admin/votes:
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
 * /admin/votes/{id}:
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

/**
 * @swagger
 * /admin/votes:
 *   post:
 *     tags: [Votes]
 *     summary: Create new vote
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Vote created successfully
 */
router.post('/votes', voteController.createVote)

/**
 * @swagger
 * /admin/votes/{id}:
 *   put:
 *     tags: [Votes]
 *     summary: Update vote
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
 *         description: Vote updated successfully
 */
router.put('/votes/:id', voteController.updateVote)

/**
 * @swagger
 * /admin/votes/{id}:
 *   delete:
 *     tags: [Votes]
 *     summary: Delete vote
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
 *         description: Vote deleted successfully
 */
router.delete('/votes/:id', voteController.deleteVote)

// Vote item routes
/**
 * @swagger
 * /admin/vote-items:
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
 * /admin/vote-items/{id}:
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

/**
 * @swagger
 * /admin/vote-items:
 *   post:
 *     tags: [VoteItems]
 *     summary: Create new vote item
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Vote item created successfully
 */
router.post('/vote-items', voteItemController.createVoteItem)

/**
 * @swagger
 * /admin/vote-items/{id}:
 *   put:
 *     tags: [VoteItems]
 *     summary: Update vote item
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
 *         description: Vote item updated successfully
 */
router.put('/vote-items/:id', voteItemController.updateVoteItem)

/**
 * @swagger
 * /admin/vote-items/{id}:
 *   delete:
 *     tags: [VoteItems]
 *     summary: Delete vote item
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
 *         description: Vote item deleted successfully
 */
router.delete('/vote-items/:id', voteItemController.deleteVoteItem)

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
 * /admin/access-token:
 *   post:
 *     tags: [AccessTokens]
 *     summary: Create new access token
 *     description: Create a new access token
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - app_name
 *               - channel
 *               - user_id
 *             properties:
 *               app_name:
 *                 type: string
 *                 description: Application name
 *               channel:
 *                 type: string
 *                 description: Channel name
 *               user_id:
 *                 type: integer
 *                 description: User ID
 *               status:
 *                 type: integer
 *                 default: 10
 *                 description: Token status
 *     responses:
 *       201:
 *         description: Access token created successfully
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
 *       400:
 *         description: Invalid input data
 */
router.post('/access-token', accessTokenController.createAccessToken)

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
 * /admin/access-token/{id}:
 *   put:
 *     tags: [AccessTokens]
 *     summary: Update access token
 *     description: Update an existing access token
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Access token ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               app_name:
 *                 type: string
 *                 description: Application name
 *               channel:
 *                 type: string
 *                 description: Channel name
 *               user_id:
 *                 type: integer
 *                 description: User ID
 *               status:
 *                 type: integer
 *                 description: Token status
 *     responses:
 *       200:
 *         description: Access token updated successfully
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
 *       400:
 *         description: Invalid input data
 */
router.put('/access-token/:id', accessTokenController.updateAccessToken)

/**
 * @swagger
 * /admin/access-token/{id}:
 *   delete:
 *     tags: [AccessTokens]
 *     summary: Delete access token
 *     description: Soft delete an access token (logical deletion)
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
 *         description: Access token deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Access token deleted successfully
 *       404:
 *         description: Access token not found
 */

router.delete('/access-token/:id', accessTokenController.deleteAccessToken)

export default router
