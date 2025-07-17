/**
 * VOTE ITEM ROUTES 模块 Swagger 文档
 *
 * 此文件包含 vote item routes 相关的所有 API 文档
 * 自动生成
 */

/**
 * @swagger
 * /content/vote-items:
 *   get:
 *     tags: [ContentVoteItems]
 *     summary: 获取投票项目列表
 *     description: 获取投票项目列表
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
 *         description: Vote item title (fuzzy search)
 *       - in: query
 *         name: vote_id
 *         schema:
 *           type: integer
 *         description: Vote ID filter
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *         description: Status filter
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
 * /content/vote-items/{id}:
 *   get:
 *     tags: [ContentVoteItems]
 *     summary: 获取投票项目详情
 *     description: 获取投票项目详情
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
 *         description: 投票项目ID
 *     responses:
 *       200:
 *         description: 操作成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 投票项目不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export default {};
