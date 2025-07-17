/**
 * ADS 模块 Swagger 文档
 *
 * 此文件包含 ads 相关的所有 API 文档
 * 自动从 routes.ts 文件提取生成
 */

/**
 * @swagger
 * /admin/ads:
 *   get:
 *     tags: [Ads]
 *     summary: 获取广告列表
 *     description: 获取广告列表，支持分页和搜索
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
 *         description: 广告标题（模糊搜索）
 *       - in: query
 *         name: alias
 *         schema:
 *           type: string
 *         description: 广告别名（模糊搜索）
 *       - in: query
 *         name: type_id
 *         schema:
 *           type: integer
 *         description: 广告类型ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *         description: 广告状态
 *       - in: query
 *         name: sort
 *         schema:
 *           type: integer
 *         description: 排序值
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
 *       - in: query
 *         name: content
 *         schema:
 *           type: string
 *         description: 广告内容（模糊搜索）
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
 * /admin/ads/{id}:
 *   get:
 *     tags: [Ads]
 *     summary: 获取广告详情
 *     description: 根据ID获取广告详情
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 广告ID
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 广告不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /admin/ads:
 *   post:
 *     tags: [Ads]
 *     summary: 创建广告
 *     description: 创建新广告
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, position]
 *             properties:
 *               title:
 *                 type: string
 *                 description: 广告标题
 *               position:
 *                 type: string
 *                 description: 广告位置
 *               content:
 *                 type: string
 *                 description: 广告内容
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
 *       400:
 *         description: 参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /admin/ads/{id}:
 *   put:
 *     tags: [Ads]
 *     summary: 更新广告
 *     description: 根据ID更新广告信息
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 广告ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 广告标题
 *               position:
 *                 type: string
 *                 description: 广告位置
 *               content:
 *                 type: string
 *                 description: 广告内容
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
 *       404:
 *         description: 广告不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /admin/ads/{id}:
 *   delete:
 *     tags: [Ads]
 *     summary: 删除广告
 *     description: 根据ID删除广告（软删除）
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 广告ID
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 广告不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export default {};
