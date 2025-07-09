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
 *         name: search
 *         schema:
 *           type: string
 *         description: 搜索关键词
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
