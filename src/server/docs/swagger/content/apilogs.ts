/**
 * API LOG ROUTES 模块 Swagger 文档
 *
 * 此文件包含 api log routes 相关的所有 API 文档
 * 自动生成
 */

/**
 * @swagger
 * /content/api-logs:
 *   get:
 *     tags: [ContentApiLogs]
 *     summary: 获取API日志列表
 *     description: 获取API日志列表
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
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: 用户ID
 *       - in: query
 *         name: method
 *         schema:
 *           type: string
 *         description: 请求方法
 *       - in: query
 *         name: path
 *         schema:
 *           type: string
 *         description: 请求路径（模糊搜索）
 *       - in: query
 *         name: status_code
 *         schema:
 *           type: integer
 *         description: 响应状态码
 *       - in: query
 *         name: body
 *         schema:
 *           type: string
 *         description: POST请求体（模糊搜索）
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Query参数（模糊搜索）
 *       - in: query
 *         name: ip
 *         schema:
 *           type: string
 *         description: 来源IP
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *         description: 日志状态
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
 *         description: 操作成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

/**
 * @swagger
 * /content/api-logs/{id}:
 *   get:
 *     tags: [ContentApiLogs]
 *     summary: 获取API日志详情
 *     description: 获取API日志详情
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
 *         description: API日志ID
 *     responses:
 *       200:
 *         description: 操作成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: API日志不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export default {};
