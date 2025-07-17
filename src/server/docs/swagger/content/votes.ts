/**
 * VOTE ROUTES 模块 Swagger 文档
 *
 * 此文件包含 vote routes 相关的所有 API 文档
 * 自动生成
 */

/**
 * @swagger
 * /content/votes:
 *   get:
 *     tags: [ContentVotes]
 *     summary: 获取投票列表
 *     description: 获取投票列表
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
 *         description: Vote title (fuzzy search)
 *       - in: query
 *         name: count
 *         schema:
 *           type: integer
 *         description: Vote count
 *       - in: query
 *         name: is_multiple
 *         schema:
 *           type: integer
 *         description: Whether multiple selection is allowed
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *         description: Vote status
 *       - in: query
 *         name: vote_items
 *         schema:
 *           type: string
 *         description: Vote items (fuzzy search)
 *       - in: query
 *         name: is_delete
 *         schema:
 *           type: integer
 *         description: Deletion status
 *       - in: query
 *         name: update_time
 *         schema:
 *           type: integer
 *         description: Update timestamp
 *       - in: query
 *         name: create_time
 *         schema:
 *           type: integer
 *         description: Creation timestamp
 *       - in: query
 *         name: start_time
 *         schema:
 *           type: integer
 *         description: Start time timestamp
 *       - in: query
 *         name: end_time
 *         schema:
 *           type: integer
 *         description: End time timestamp
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
 * /content/votes/{id}:
 *   get:
 *     tags: [ContentVotes]
 *     summary: 获取投票详情
 *     description: 获取投票详情
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
 *         description: 投票ID
 *     responses:
 *       200:
 *         description: 操作成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 投票不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export default {};
