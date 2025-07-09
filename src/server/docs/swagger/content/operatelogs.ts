/**
 * OPERATE LOG ROUTES 模块 Swagger 文档
 * 
 * 此文件包含 operate log routes 相关的所有 API 文档
 * 自动生成
 */

/**
 * @swagger
 * /content/operate-logs:
 *   get:
 *     tags: [ContentOperateLogs]
 *     summary: 获取操作日志列表
 *     description: 获取操作日志列表
 *     security:
 *       - accessTokenAuth: []
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
 *         description: 操作成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

/**
 * @swagger
 * /content/operate-logs/{id}:
 *   get:
 *     tags: [ContentOperateLogs]
 *     summary: 获取操作日志详情
 *     description: 获取操作日志详情
 *     security:
 *       - accessTokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 操作日志ID
 *     responses:
 *       200:
 *         description: 操作成功
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

export default {};
