/**
 * ACCESS-TOKENS 模块 Swagger 文档
 * 
 * 此文件包含 access-tokens 相关的所有 API 文档
 * 自动从 routes.ts 文件提取生成
 */

/**
 * @swagger
 * /admin/access-token:
 *   get:
 *     tags: [AccessTokens]
 *     summary: 获取Access Token列表
 *     description: 获取Access Token列表，支持分页和搜索
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 页码
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 每页数量
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 搜索关键词
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

/**
 * @swagger
 * /admin/access-token:
 *   post:
 *     tags: [AccessTokens]
 *     summary: 创建Access Token
 *     description: 创建新的Access Token
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, app_name, channel]
 *             properties:
 *               name:
 *                 type: string
 *                 description: Token名称
 *               app_name:
 *                 type: string
 *                 description: 应用名称
 *               channel:
 *                 type: string
 *                 description: 渠道名称
 *               description:
 *                 type: string
 *                 description: Token描述
 *               expire_time:
 *                 type: string
 *                 format: date-time
 *                 description: 过期时间
 *               status:
 *                 type: integer
 *                 description: 状态
 *     responses:
 *       200:
 *         description: 创建成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

/**
 * @swagger
 * /admin/access-token/{id}:
 *   get:
 *     tags: [AccessTokens]
 *     summary: 获取Access Token详情
 *     description: 根据ID获取Access Token详情
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Access Token ID
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Access Token不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /admin/access-token/{id}:
 *   put:
 *     tags: [AccessTokens]
 *     summary: 更新Access Token
 *     description: 根据ID更新Access Token信息
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Access Token ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Token名称
 *               app_name:
 *                 type: string
 *                 description: 应用名称
 *               channel:
 *                 type: string
 *                 description: 渠道名称
 *               description:
 *                 type: string
 *                 description: Token描述
 *               expire_time:
 *                 type: string
 *                 format: date-time
 *                 description: 过期时间
 *               status:
 *                 type: integer
 *                 description: 状态
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

/**
 * @swagger
 * /admin/access-token/{id}:
 *   delete:
 *     tags: [AccessTokens]
 *     summary: 删除Access Token
 *     description: 根据ID删除Access Token（软删除）
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Access Token ID
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

export default {};
