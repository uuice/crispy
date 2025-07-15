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
 *         name: code
 *         schema:
 *           type: string
 *         description: 操作代码（模糊搜索）
 *       - in: query
 *         name: content
 *         schema:
 *           type: string
 *         description: 操作内容（模糊搜索）
 *       - in: query
 *         name: type_id
 *         schema:
 *           type: integer
 *         description: 操作类型ID
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: 用户ID
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
 * /content/operate-logs/{id}:
 *   get:
 *     tags: [ContentOperateLogs]
 *     summary: 获取操作日志详情
 *     description: 获取操作日志详情
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
