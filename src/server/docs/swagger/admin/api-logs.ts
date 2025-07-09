/**
 * API-LOGS 模块 Swagger 文档
 * 
 * 此文件包含 api-logs 相关的所有 API 文档
 * 自动从 routes.ts 文件提取生成
 */

/**
 * @swagger
 * /admin/api-logs:
 *   get:
 *     tags: [ApiLogs]
 *     summary: 获取API日志列表
 *     description: 获取API日志列表，支持分页和搜索
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
 * /admin/api-logs/{id}:
 *   get:
 *     tags: [ApiLogs]
 *     summary: 获取API日志详情
 *     description: 根据ID获取API日志详情
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: API日志ID
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
 * /admin/api-logs:
 *   post:
 *     tags: [ApiLogs]
 *     summary: 创建API日志
 *     description: 创建新API日志
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [method, url]
 *             properties:
 *               method:
 *                 type: string
 *                 description: 请求方法
 *               url:
 *                 type: string
 *                 description: 请求URL
 *               request_data:
 *                 type: string
 *                 description: 请求数据
 *               response_data:
 *                 type: string
 *                 description: 响应数据
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
 * /admin/api-logs/{id}:
 *   put:
 *     tags: [ApiLogs]
 *     summary: 更新API日志
 *     description: 根据ID更新API日志
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: API日志ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               method:
 *                 type: string
 *                 description: 请求方法
 *               url:
 *                 type: string
 *                 description: 请求URL
 *               request_data:
 *                 type: string
 *                 description: 请求数据
 *               response_data:
 *                 type: string
 *                 description: 响应数据
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
 * /admin/api-logs/{id}:
 *   delete:
 *     tags: [ApiLogs]
 *     summary: 删除API日志
 *     description: 根据ID删除API日志（软删除）
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: API日志ID
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

export default {};
