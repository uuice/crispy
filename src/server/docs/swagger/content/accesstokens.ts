/**
 * ACCESS TOKEN ROUTES 模块 Swagger 文档
 * 
 * 此文件包含 access token routes 相关的所有 API 文档
 * 自动生成
 */

/**
 * @swagger
 * /content/access-token:
 *   get:
 *     tags: [ContentAccessTokens]
 *     summary: 获取Access Token列表
 *     description: 获取Access Token列表
 *     security:
 *       - accessTokenAuth: []
 *         appNameAuth: []
 *         channelAuth: []
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
 *         description: 操作成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

/**
 * @swagger
 * /content/access-token/{id}:
 *   get:
 *     tags: [ContentAccessTokens]
 *     summary: 获取Access Token详情
 *     description: 获取Access Token详情
 *     security:
 *       - accessTokenAuth: []
 *         appNameAuth: []
 *         channelAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Access TokenID
 *     responses:
 *       200:
 *         description: 操作成功
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
 * /content/access-token/check:
 *   post:
 *     tags: [ContentAccessTokens]
 *     summary: 验证Access Token
 *     description: 验证Access Token
 *     security:
 *       - accessTokenAuth: []
 *         appNameAuth: []
 *         channelAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [app_name, channel, token]
 *             properties:
 *               app_name:
 *                 type: string
 *                 description: 应用名称
 *               channel:
 *                 type: string
 *                 description: 渠道名称
 *               token:
 *                 type: string
 *                 description: Access Token
 *     responses:
 *       200:
 *         description: 操作成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Token验证失败
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export default {};
