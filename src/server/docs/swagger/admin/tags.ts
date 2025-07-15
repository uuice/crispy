/**
 * TAGS 模块 Swagger 文档
 *
 * 此文件包含 tags 相关的所有 API 文档
 * 自动从 routes.ts 文件提取生成
 */

/**
 * @swagger
 * /admin/tags:
 *   get:
 *     tags: [Tags]
 *     summary: 获取标签列表
 *     description: 获取标签列表，支持分页和搜索
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
 *         description: 标签标题（模糊搜索）
 *       - in: query
 *         name: alias
 *         schema:
 *           type: string
 *         description: 标签别名（模糊搜索）
 *       - in: query
 *         name: des
 *         schema:
 *           type: string
 *         description: 标签描述（模糊搜索）
 *       - in: query
 *         name: value
 *         schema:
 *           type: string
 *         description: 标签值（模糊搜索）
 *       - in: query
 *         name: type_id
 *         schema:
 *           type: integer
 *         description: 标签类型ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *         description: 标签状态
 *       - in: query
 *         name: sort_min
 *         schema:
 *           type: integer
 *         description: 排序最小值
 *       - in: query
 *         name: sort_max
 *         schema:
 *           type: integer
 *         description: 排序最大值
 *       - in: query
 *         name: start_time
 *         schema:
 *           type: integer
 *         description: 开始时间戳
 *       - in: query
 *         name: end_time
 *         schema:
 *           type: integer
 *         description: 结束时间戳
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
 * /admin/tags/{id}:
 *   get:
 *     tags: [Tags]
 *     summary: 获取标签详情
 *     description: 根据ID获取标签详情
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 标签ID
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 标签不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /admin/tags:
 *   post:
 *     tags: [Tags]
 *     summary: 创建标签
 *     description: 创建新标签
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 description: 标签名称
 *               color:
 *                 type: string
 *                 description: 标签颜色
 *               description:
 *                 type: string
 *                 description: 标签描述
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
 * /admin/tags/{id}:
 *   put:
 *     tags: [Tags]
 *     summary: 更新标签
 *     description: 根据ID更新标签信息
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 标签ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 标签名称
 *               color:
 *                 type: string
 *                 description: 标签颜色
 *               description:
 *                 type: string
 *                 description: 标签描述
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
 * /admin/tags/{id}:
 *   delete:
 *     tags: [Tags]
 *     summary: 删除标签
 *     description: 根据ID删除标签（软删除）
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 标签ID
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

export default {};
