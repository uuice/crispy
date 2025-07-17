/**
 * NOTICE ROUTES 模块 Swagger 文档
 *
 * 此文件包含 notice routes 相关的所有 API 文档
 * 自动生成
 */

/**
 * @swagger
 * /content/notices:
 *   get:
 *     tags: [ContentNotices]
 *     summary: 获取通知列表
 *     description: 获取通知列表
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
 *         description: 通知标题（模糊搜索）
 *       - in: query
 *         name: content
 *         schema:
 *           type: string
 *         description: 通知内容（模糊搜索）
 *       - in: query
 *         name: from_user_id
 *         schema:
 *           type: integer
 *         description: 发布者用户ID
 *       - in: query
 *         name: tolds
 *         schema:
 *           type: string
 *         description: 接收者ID列表（模糊搜索）
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *         description: 通知状态
 *       - in: query
 *         name: publish_time
 *         schema:
 *           type: integer
 *         description: 发布时间戳
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
 * /content/notices/{id}:
 *   get:
 *     tags: [ContentNotices]
 *     summary: 获取通知详情
 *     description: 获取通知详情
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
 *         description: 通知ID
 *     responses:
 *       200:
 *         description: 操作成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 通知不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export default {};
