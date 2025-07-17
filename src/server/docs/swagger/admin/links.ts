/**
 * LINKS 模块 Swagger 文档
 *
 * 此文件包含 links 相关的所有 API 文档
 * 自动从 routes.ts 文件提取生成
 */

/**
 * @swagger
 * /admin/links:
 *   get:
 *     tags: [Links]
 *     summary: 获取链接列表
 *     description: 获取链接列表，支持分页和搜索
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
 *         name: site_name
 *         schema:
 *           type: string
 *         description: 站点名称（模糊搜索）
 *       - in: query
 *         name: url
 *         schema:
 *           type: string
 *         description: 链接地址（模糊搜索）
 *       - in: query
 *         name: des
 *         schema:
 *           type: string
 *         description: 链接描述（模糊搜索）
 *       - in: query
 *         name: logo
 *         schema:
 *           type: string
 *         description: Logo图标（模糊搜索）
 *       - in: query
 *         name: method
 *         schema:
 *           type: string
 *         description: 打开方式
 *       - in: query
 *         name: type_id
 *         schema:
 *           type: integer
 *         description: 分类ID
 *       - in: query
 *         name: sort
 *         schema:
 *           type: integer
 *         description: 排序值
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *         description: 链接状态
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
 * /admin/links/{id}:
 *   get:
 *     tags: [Links]
 *     summary: 获取链接详情
 *     description: 根据ID获取链接详情
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 链接ID
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
 * /admin/links:
 *   post:
 *     tags: [Links]
 *     summary: 创建链接
 *     description: 创建新链接
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, url]
 *             properties:
 *               title:
 *                 type: string
 *                 description: 链接标题
 *               url:
 *                 type: string
 *                 description: 链接地址
 *               description:
 *                 type: string
 *                 description: 链接描述
 *               category:
 *                 type: string
 *                 description: 链接分类
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
 * /admin/links/{id}:
 *   put:
 *     tags: [Links]
 *     summary: 更新链接
 *     description: 根据ID更新链接信息
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 链接ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 链接标题
 *               url:
 *                 type: string
 *                 description: 链接地址
 *               description:
 *                 type: string
 *                 description: 链接描述
 *               category:
 *                 type: string
 *                 description: 链接分类
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
 * /admin/links/{id}:
 *   delete:
 *     tags: [Links]
 *     summary: 删除链接
 *     description: 根据ID删除链接（软删除）
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 链接ID
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

export default {};
