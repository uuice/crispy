/**
 * CATEGORIES 模块 Swagger 文档
 *
 * 此文件包含 categories 相关的所有 API 文档
 * 自动从 routes.ts 文件提取生成
 */

/**
 * @swagger
 * /admin/categories:
 *   get:
 *     tags: [Categories]
 *     summary: 获取分类列表
 *     description: 获取分类列表，支持分页和搜索
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
 *         name: update_time
 *         schema:
 *           type: integer
 *         description: 更新时间（时间戳）
 *       - in: query
 *         name: create_time
 *         schema:
 *           type: integer
 *         description: 创建时间（时间戳）
 *       - in: query
 *         name: start_time
 *         schema:
 *           type: integer
 *         description: 开始时间（时间戳）
 *       - in: query
 *         name: end_time
 *         schema:
 *           type: integer
 *         description: 结束时间（时间戳）
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
 * /admin/categories/tree:
 *   get:
 *     tags: [Categories]
 *     summary: 获取分类树形结构
 *     description: 获取分类的树形结构数据
 *     security:
 *       - bearerAuth: []
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
 * /admin/categories/{id}:
 *   get:
 *     tags: [Categories]
 *     summary: 获取分类详情
 *     description: 根据ID获取分类详情
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 分类ID
 *     responses:
 *       200:
 *         description: 获取成功
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
 * /admin/categories:
 *   post:
 *     tags: [Categories]
 *     summary: 创建分类
 *     description: 创建新分类
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 description: 分类标题
 *               alias:
 *                 type: string
 *                 description: 分类别名
 *               parent_id:
 *                 type: integer
 *                 description: 父分类ID
 *               description:
 *                 type: string
 *                 description: 分类描述
 *               sort:
 *                 type: integer
 *                 description: 排序
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
 *       400:
 *         description: 参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /admin/categories/{id}:
 *   put:
 *     tags: [Categories]
 *     summary: 更新分类
 *     description: 根据ID更新分类信息
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 分类ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 分类标题
 *               alias:
 *                 type: string
 *                 description: 分类别名
 *               parent_id:
 *                 type: integer
 *                 description: 父分类ID
 *               description:
 *                 type: string
 *                 description: 分类描述
 *               sort:
 *                 type: integer
 *                 description: 排序
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
 *       404:
 *         description: 分类不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /admin/categories/{id}:
 *   delete:
 *     tags: [Categories]
 *     summary: 删除分类
 *     description: 根据ID删除分类（软删除）
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 分类ID
 *     responses:
 *       200:
 *         description: 删除成功
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
