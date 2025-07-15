/**
 * Vote Items API Swagger 文档
 *
 * 此文件包含投票项目相关的 API 文档
 * 投票项目是投票的子项目，包含具体的投票选项
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     VoteItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 投票项目ID
 *         title:
 *           type: string
 *           description: 投票项目标题
 *         description:
 *           type: string
 *           description: 投票项目描述
 *         vote_id:
 *           type: integer
 *           description: 所属投票ID
 *         votes_count:
 *           type: integer
 *           description: 投票数量
 *         status:
 *           type: integer
 *           description: 状态 (0-禁用, 1-启用)
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: 更新时间
 *       required: [title, vote_id]
 */

/**
 * @swagger
 * /admin/vote-items:
 *   get:
 *     tags: [VoteItems]
 *     summary: 获取投票项目列表
 *     description: 获取投票项目列表，支持分页和搜索
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
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /admin/vote-items/{id}:
 *   get:
 *     tags: [VoteItems]
 *     summary: 获取投票项目详情
 *     description: 根据ID获取投票项目详情
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 投票项目ID
 *     responses:
 *       200:
 *         description: 获取成功
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
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /admin/vote-items:
 *   post:
 *     tags: [VoteItems]
 *     summary: 创建投票项目
 *     description: 创建新投票项目
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, vote_id]
 *             properties:
 *               title:
 *                 type: string
 *                 description: 投票项目标题
 *               description:
 *                 type: string
 *                 description: 投票项目描述
 *               vote_id:
 *                 type: integer
 *                 description: 所属投票ID
 *               status:
 *                 type: integer
 *                 default: 1
 *                 description: 状态 (0-禁用, 1-启用)
 *     responses:
 *       200:
 *         description: 创建成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: 参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /admin/vote-items/{id}:
 *   put:
 *     tags: [VoteItems]
 *     summary: 更新投票项目
 *     description: 根据ID更新投票项目信息
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 投票项目ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 投票项目标题
 *               description:
 *                 type: string
 *                 description: 投票项目描述
 *               vote_id:
 *                 type: integer
 *                 description: 所属投票ID
 *               status:
 *                 type: integer
 *                 description: 状态 (0-禁用, 1-启用)
 *     responses:
 *       200:
 *         description: 更新成功
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
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /admin/vote-items/{id}:
 *   delete:
 *     tags: [VoteItems]
 *     summary: 删除投票项目
 *     description: 根据ID删除投票项目（软删除）
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 投票项目ID
 *     responses:
 *       200:
 *         description: 删除成功
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
 *       401:
 *         description: 未授权
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
