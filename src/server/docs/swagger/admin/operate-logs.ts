/**
 * OPERATE-LOGS 模块 Swagger 文档
 * 
 * 此文件包含 operate-logs 相关的所有 API 文档
 * 自动从 routes.ts 文件提取生成
 */

/**
 * @swagger
 * /admin/operate-logs:
 *   get:
 *     tags: [OperateLogs]
 *     summary: 获取操作日志列表
 *     description: 获取操作日志列表，支持分页
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
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: 用户ID
 *       - in: query
 *         name: type_id
 *         schema:
 *           type: integer
 *         description: 操作类型ID
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
 * /admin/operate-logs/{id}:
 *   get:
 *     tags: [OperateLogs]
 *     summary: 获取操作日志详情
 *     description: 根据ID获取操作日志详情
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 操作日志ID
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 操作日志不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /admin/operate-logs:
 *   post:
 *     tags: [OperateLogs]
 *     summary: 创建操作日志
 *     description: 创建新操作日志
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, content]
 *             properties:
 *               code:
 *                 type: string
 *                 description: 操作代码
 *               content:
 *                 type: string
 *                 description: 操作内容
 *               type_id:
 *                 type: integer
 *                 description: 操作类型ID
 *               user_id:
 *                 type: integer
 *                 description: 用户ID
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
 * /admin/operate-logs/{id}:
 *   put:
 *     tags: [OperateLogs]
 *     summary: 更新操作日志
 *     description: 根据ID更新操作日志信息
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 操作日志ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: 操作代码
 *               content:
 *                 type: string
 *                 description: 操作内容
 *               type_id:
 *                 type: integer
 *                 description: 操作类型ID
 *               user_id:
 *                 type: integer
 *                 description: 用户ID
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
 * /admin/operate-logs/{id}:
 *   delete:
 *     tags: [OperateLogs]
 *     summary: 删除操作日志
 *     description: 根据ID删除操作日志（软删除）
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 操作日志ID
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

export default {};
