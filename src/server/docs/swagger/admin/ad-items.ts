/**
 * Ad Items API Swagger 文档
 *
 * 此文件包含广告项目相关的 API 文档
 * 广告项目是广告的子项目，包含具体的广告内容
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AdItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 广告项目ID
 *         title:
 *           type: string
 *           description: 广告项目标题
 *         content:
 *           type: string
 *           description: 广告项目内容
 *         url:
 *           type: string
 *           description: 链接地址
 *         image:
 *           type: string
 *           description: 图片地址
 *         ad_id:
 *           type: integer
 *           description: 所属广告ID
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
 *       required: [title, ad_id]
 */

/**
 * @swagger
 * /admin/ad-items:
 *   get:
 *     tags: [AdItems]
 *     summary: 获取广告项目列表
 *     description: 获取广告项目列表，支持分页和搜索
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
 *         name: ad_id
 *         schema:
 *           type: integer
 *         description: 广告ID过滤
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: 广告项目标题（模糊搜索）
 *       - in: query
 *         name: content
 *         schema:
 *           type: string
 *         description: 广告项目内容（模糊搜索）
 *       - in: query
 *         name: image_url
 *         schema:
 *           type: string
 *         description: 图片URL（模糊搜索）
 *       - in: query
 *         name: url
 *         schema:
 *           type: string
 *         description: 链接地址（模糊搜索）
 *       - in: query
 *         name: method
 *         schema:
 *           type: string
 *         description: 打开方式
 *       - in: query
 *         name: sort
 *         schema:
 *           type: integer
 *         description: 排序值
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *         description: 状态过滤
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
 * /admin/ad-items/{id}:
 *   get:
 *     tags: [AdItems]
 *     summary: 获取广告项目详情
 *     description: 根据ID获取广告项目详情
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 广告项目ID
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 广告项目不存在
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
 * /admin/ad-items:
 *   post:
 *     tags: [AdItems]
 *     summary: 创建广告项目
 *     description: 创建新广告项目
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, ad_id]
 *             properties:
 *               title:
 *                 type: string
 *                 description: 广告项目标题
 *               ad_id:
 *                 type: integer
 *                 description: 所属广告ID
 *               content:
 *                 type: string
 *                 description: 广告项目内容
 *               url:
 *                 type: string
 *                 description: 链接地址
 *               image:
 *                 type: string
 *                 description: 图片地址
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
 * /admin/ad-items/{id}:
 *   put:
 *     tags: [AdItems]
 *     summary: 更新广告项目
 *     description: 根据ID更新广告项目信息
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 广告项目ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 广告项目标题
 *               ad_id:
 *                 type: integer
 *                 description: 所属广告ID
 *               content:
 *                 type: string
 *                 description: 广告项目内容
 *               url:
 *                 type: string
 *                 description: 链接地址
 *               image:
 *                 type: string
 *                 description: 图片地址
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
 *         description: 广告项目不存在
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
 * /admin/ad-items/{id}:
 *   delete:
 *     tags: [AdItems]
 *     summary: 删除广告项目
 *     description: 根据ID删除广告项目（软删除）
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 广告项目ID
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 广告项目不存在
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
