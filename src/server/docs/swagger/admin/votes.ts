/**
 * VOTES 模块 Swagger 文档
 *
 * 此文件包含 votes 相关的所有 API 文档
 * 自动从 routes.ts 文件提取生成
 */

/**
 * @swagger
 * /admin/votes:
 *   get:
 *     tags: [Votes]
 *     summary: 获取投票列表
 *     description: 获取投票列表，支持分页和搜索
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
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

/**
 * @swagger
 * /admin/votes/{id}:
 *   get:
 *     tags: [Votes]
 *     summary: 获取投票详情
 *     description: 根据ID获取投票详情
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 投票ID
 *     responses:
 *       200:
 *         description: 获取成功
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

/**
 * @swagger
 * /admin/votes:
 *   post:
 *     tags: [Votes]
 *     summary: 创建投票
 *     description: 创建新投票
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description]
 *             properties:
 *               title:
 *                 type: string
 *                 description: 投票标题
 *               description:
 *                 type: string
 *                 description: 投票描述
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 description: 开始时间
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 description: 结束时间
 *               max_votes:
 *                 type: integer
 *                 description: 最大投票数
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
 * /admin/votes/{id}:
 *   put:
 *     tags: [Votes]
 *     summary: 更新投票
 *     description: 根据ID更新投票信息
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 投票ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 投票标题
 *               description:
 *                 type: string
 *                 description: 投票描述
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 description: 开始时间
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 description: 结束时间
 *               max_votes:
 *                 type: integer
 *                 description: 最大投票数
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
 * /admin/votes/{id}:
 *   delete:
 *     tags: [Votes]
 *     summary: 删除投票
 *     description: 根据ID删除投票（软删除）
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 投票ID
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

export default {};
