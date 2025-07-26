/**
 * CATEGORY ROUTES 模块 Swagger 文档
 *
 * 此文件包含 category routes 相关的所有 API 文档
 * 自动生成
 */

/**
 * @swagger
 * /content/categories:
 *   get:
 *     tags: [ContentCategories]
 *     summary: 获取分类列表
 *     description: 获取分类列表
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
 *         name: title
 *         schema:
 *           type: string
 *         description: 分类标题（模糊搜索）
 *       - in: query
 *         name: alias
 *         schema:
 *           type: string
 *         description: 分类别名（模糊搜索）
 *       - in: query
 *         name: des
 *         schema:
 *           type: string
 *         description: 分类描述（模糊搜索）
 *       - in: query
 *         name: parent_id
 *         schema:
 *           type: integer
 *         description: 父分类ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *         description: 状态 (-10-禁用, 10-启用)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: integer
 *         description: 排序
 *       - in: query
 *         name: is_delete
 *         schema:
 *           type: integer
 *         description: 是否删除 (0-未删除, 1-已删除)
 *       - in: query
 *         name: update_time
 *         schema:
 *           type: integer
 *         description: 更新时间（时间戳）
 *       - in: query
 *         name: create_time
 *         schema:
 *           type: integer
 *         description: 创建时间（时间戳）
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
 * /content/categories/tree:
 *   get:
 *     tags: [ContentCategories]
 *     summary: 获取分类树形结构
 *     description: 获取分类树形结构
 *     security:
 *       - accessTokenAuth: []
 *         appNameAuth: []
 *         channelAuth: []
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
 * /content/categories/{id}:
 *   get:
 *     tags: [ContentCategories]
 *     summary: 获取分类详情
 *     description: 获取分类详情
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
 *         description: 分类ID
 *     responses:
 *       200:
 *         description: 操作成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 分类不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /content/categories/alias/{alias}:
 *   get:
 *     tags: [ContentCategories]
 *     summary: 根据别名获取分类详情
 *     description: 根据别名获取分类详情
 *     security:
 *       - accessTokenAuth: []
 *         appNameAuth: []
 *         channelAuth: []
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         schema:
 *           type: string
 *         description: 分类别名
 *     responses:
 *       200:
 *         description: 操作成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 分类不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /content/categories/with-count:
 *   get:
 *     tags: [ContentCategories]
 *     summary: 获取分类列表及其文章数
 *     description: 获取分类列表，包含每个分类下的文章数量
 *     security:
 *       - accessTokenAuth: []
 *         appNameAuth: []
 *         channelAuth: []
 *     parameters:
 *       - in: query
 *         name: parentAlias
 *         schema:
 *           type: string
 *         description: 父分类别名，如 POST_SYS_CAT
 *     responses:
 *       200:
 *         description: 操作成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       title:
 *                         type: string
 *                         example: "前端开发"
 *                       alias:
 *                         type: string
 *                         example: "frontend"
 *                       des:
 *                         type: string
 *                         example: "前端开发相关文章"
 *                       parent_id:
 *                         type: integer
 *                         example: 1
 *                       sort:
 *                         type: integer
 *                         example: 0
 *                       status:
 *                         type: integer
 *                         example: 10
 *                       create_time:
 *                         type: integer
 *                         example: 1656499072000
 *                       update_time:
 *                         type: integer
 *                         example: 1656499072000
 *                       article_count:
 *                         type: integer
 *                         example: 15
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: 服务器内部错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export default {};
