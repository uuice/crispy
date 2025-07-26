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

export default {};
