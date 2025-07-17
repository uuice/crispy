/**
 * KEYWORDS 模块 Swagger 文档
 *
 * 此文件包含 keywords 相关的所有 API 文档
 * 自动从 routes.ts 文件提取生成
 */

/**
 * @swagger
 * /admin/keywords:
 *   get:
 *     tags: [Keywords]
 *     summary: 获取关键词列表
 *     description: 获取关键词列表，支持分页和搜索
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
 *         name: title
 *         schema:
 *           type: string
 *         description: 关键词标题（模糊搜索）
 *       - in: query
 *         name: alias
 *         schema:
 *           type: string
 *         description: 关键词别名（模糊搜索）
 *       - in: query
 *         name: count
 *         schema:
 *           type: integer
 *         description: 关键词计数
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *         description: 关键词状态
 *       - in: query
 *         name: type_id
 *         schema:
 *           type: integer
 *         description: 关键词类型ID
 *       - in: query
 *         name: url
 *         schema:
 *           type: string
 *         description: 关键词URL（模糊搜索）
 *       - in: query
 *         name: value
 *         schema:
 *           type: string
 *         description: 关键词值（模糊搜索）
 *       - in: query
 *         name: is_delete
 *         schema:
 *           type: integer
 *         description: 删除状态
 *       - in: query
 *         name: update_time
 *         schema:
 *           type: integer
 *         description: 更新时间戳
 *       - in: query
 *         name: create_time
 *         schema:
 *           type: integer
 *         description: 创建时间戳
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
 * /admin/keywords/{id}:
 *   get:
 *     tags: [Keywords]
 *     summary: 获取关键词详情
 *     description: 根据ID获取关键词详情
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 关键词ID
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
 * /admin/keywords:
 *   post:
 *     tags: [Keywords]
 *     summary: 创建关键词
 *     description: 创建新关键词
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [keyword]
 *             properties:
 *               keyword:
 *                 type: string
 *                 description: 关键词
 *               description:
 *                 type: string
 *                 description: 描述
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
 * /admin/keywords/{id}:
 *   put:
 *     tags: [Keywords]
 *     summary: 更新关键词
 *     description: 根据ID更新关键词信息
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 关键词ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               keyword:
 *                 type: string
 *                 description: 关键词
 *               description:
 *                 type: string
 *                 description: 描述
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
 * /admin/keywords/{id}:
 *   delete:
 *     tags: [Keywords]
 *     summary: 删除关键词
 *     description: 根据ID删除关键词（软删除）
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 关键词ID
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

export default {};
