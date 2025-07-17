/**
 * COMMENTS 模块 Swagger 文档
 *
 * 此文件包含 comments 相关的所有 API 文档
 * 自动从 routes.ts 文件提取生成
 */

/**
 * @swagger
 * /admin/comments:
 *   get:
 *     tags: [Comments]
 *     summary: 获取评论列表
 *     description: 获取评论列表，支持分页和搜索
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
 *         description: 评论标题（模糊搜索）
 *       - in: query
 *         name: content
 *         schema:
 *           type: string
 *         description: 评论内容（模糊搜索）
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: 评论者用户ID
 *       - in: query
 *         name: parent_id
 *         schema:
 *           type: integer
 *         description: 父评论ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *         description: 评论状态
 *       - in: query
 *         name: good_article
 *         schema:
 *           type: integer
 *         description: 好评数量
 *       - in: query
 *         name: bad_article
 *         schema:
 *           type: integer
 *         description: 差评数量
 *       - in: query
 *         name: not_article
 *         schema:
 *           type: integer
 *         description: 中立评价数量
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
 *       - in: query
 *         name: start_time
 *         schema:
 *           type: integer
 *         description: 开始时间戳
 *       - in: query
 *         name: end_time
 *         schema:
 *           type: integer
 *         description: 结束时间戳
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
 * /admin/comments/{id}:
 *   get:
 *     tags: [Comments]
 *     summary: 获取评论详情
 *     description: 根据ID获取评论详情
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 评论ID
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 评论不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /admin/comments:
 *   post:
 *     tags: [Comments]
 *     summary: 创建评论
 *     description: 创建新评论
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content, article_id]
 *             properties:
 *               content:
 *                 type: string
 *                 description: 评论内容
 *               article_id:
 *                 type: integer
 *                 description: 文章ID
 *               parent_id:
 *                 type: integer
 *                 description: 父评论ID
 *               user_name:
 *                 type: string
 *                 description: 用户名
 *               user_email:
 *                 type: string
 *                 description: 用户邮箱
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
 * /admin/comments/{id}:
 *   put:
 *     tags: [Comments]
 *     summary: 更新评论
 *     description: 根据ID更新评论信息
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 评论ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: 评论内容
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
 * /admin/comments/{id}:
 *   delete:
 *     tags: [Comments]
 *     summary: 删除评论
 *     description: 根据ID删除评论（软删除）
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 评论ID
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

/**
 * @swagger
 * /admin/comments/batch-update-status:
 *   post:
 *     tags: [Comments]
 *     summary: 批量更新评论状态
 *     description: 批量更新多个评论的状态
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ids, status]
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: 评论ID列表
 *               status:
 *                 type: integer
 *                 description: 新状态
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
 * /admin/comments/batch-delete:
 *   post:
 *     tags: [Comments]
 *     summary: 批量删除评论
 *     description: 批量删除多个评论
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ids]
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: 评论ID列表
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

/**
 * @swagger
 * /admin/comments/stats:
 *   get:
 *     tags: [Comments]
 *     summary: 获取评论统计
 *     description: 获取评论统计信息
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

export default {};
