/**
 * PAGES 模块 Swagger 文档
 *
 * 此文件包含 pages 相关的所有 API 文档
 * 自动从 routes.ts 文件提取生成
 */

/**
 * @swagger
 * /admin/pages:
 *   get:
 *     tags: [Pages]
 *     summary: 获取页面列表
 *     description: 获取页面列表，支持分页和搜索
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
 *         description: 页面标题（模糊搜索）
 *       - in: query
 *         name: alias
 *         schema:
 *           type: string
 *         description: 页面别名（模糊搜索）
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *         description: 状态 (10已发布 -10待发布 -100已删除 -20草稿)
 *       - in: query
 *         name: type_id
 *         schema:
 *           type: integer
 *         description: 分类ID
 *       - in: query
 *         name: author_id
 *         schema:
 *           type: integer
 *         description: 作者ID
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: 用户ID
 *       - in: query
 *         name: url
 *         schema:
 *           type: string
 *         description: URL（模糊搜索）
 *       - in: query
 *         name: remark
 *         schema:
 *           type: string
 *         description: 备注（模糊搜索）
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: 标签（模糊搜索）
 *       - in: query
 *         name: seo_title
 *         schema:
 *           type: string
 *         description: SEO标题（模糊搜索）
 *       - in: query
 *         name: seo_description
 *         schema:
 *           type: string
 *         description: SEO描述（模糊搜索）
 *       - in: query
 *         name: seo_keywords
 *         schema:
 *           type: string
 *         description: SEO关键词（模糊搜索）
 *       - in: query
 *         name: sub_title
 *         schema:
 *           type: string
 *         description: 副标题（模糊搜索）
 *       - in: query
 *         name: abstract
 *         schema:
 *           type: string
 *         description: 摘要（模糊搜索）
 *       - in: query
 *         name: image_list
 *         schema:
 *           type: string
 *         description: 图片列表（模糊搜索）
 *       - in: query
 *         name: is_delete
 *         schema:
 *           type: integer
 *         description: 是否删除 (0-未删除, 1-已删除)
 *       - in: query
 *         name: update_time
 *         schema:
 *           type: integer
 *         description: 更新时间（时间戳）
 *       - in: query
 *         name: create_time
 *         schema:
 *           type: integer
 *         description: 创建时间（时间戳）
 *       - in: query
 *         name: start_time
 *         schema:
 *           type: integer
 *         description: 开始时间（时间戳）
 *       - in: query
 *         name: end_time
 *         schema:
 *           type: integer
 *         description: 结束时间（时间戳）
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
 * /admin/pages/{id}:
 *   get:
 *     tags: [Pages]
 *     summary: 获取页面详情
 *     description: 根据ID获取页面详情
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 页面ID
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 页面不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /admin/pages:
 *   post:
 *     tags: [Pages]
 *     summary: 创建页面
 *     description: 创建新页面
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:
 *                 type: string
 *                 description: 页面标题
 *               content:
 *                 type: string
 *                 description: 页面内容
 *               alias:
 *                 type: string
 *                 description: 页面别名
 *               template:
 *                 type: string
 *                 description: 页面模板
 *               meta_title:
 *                 type: string
 *                 description: SEO标题
 *               meta_description:
 *                 type: string
 *                 description: SEO描述
 *               meta_keywords:
 *                 type: string
 *                 description: SEO关键词
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
 * /admin/pages/{id}:
 *   put:
 *     tags: [Pages]
 *     summary: 更新页面
 *     description: 根据ID更新页面信息
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 页面ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 页面标题
 *               content:
 *                 type: string
 *                 description: 页面内容
 *               alias:
 *                 type: string
 *                 description: 页面别名
 *               template:
 *                 type: string
 *                 description: 页面模板
 *               meta_title:
 *                 type: string
 *                 description: SEO标题
 *               meta_description:
 *                 type: string
 *                 description: SEO描述
 *               meta_keywords:
 *                 type: string
 *                 description: SEO关键词
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
 * /admin/pages/{id}:
 *   delete:
 *     tags: [Pages]
 *     summary: 删除页面
 *     description: 根据ID删除页面（软删除）
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 页面ID
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

export default {};
