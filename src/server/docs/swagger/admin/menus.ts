/**
 * MENUS 模块 Swagger 文档
 *
 * 此文件包含 menus 相关的所有 API 文档
 * 自动从 routes.ts 文件提取生成
 */

/**
 * @swagger
 * /admin/menus:
 *   get:
 *     tags: [Menus]
 *     summary: 获取菜单列表
 *     description: 获取菜单列表，支持分页和搜索
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
 *         description: 菜单标题（模糊搜索）
 *       - in: query
 *         name: alias
 *         schema:
 *           type: string
 *         description: 菜单别名（模糊搜索）
 *       - in: query
 *         name: parent_id
 *         schema:
 *           type: integer
 *         description: 父菜单ID
 *       - in: query
 *         name: icon
 *         schema:
 *           type: string
 *         description: 菜单图标（模糊搜索）
 *       - in: query
 *         name: url
 *         schema:
 *           type: string
 *         description: 菜单链接（模糊搜索）
 *       - in: query
 *         name: image_url
 *         schema:
 *           type: string
 *         description: 图片URL（模糊搜索）
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
 *         description: 菜单状态
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
 * /admin/menus/tree:
 *   get:
 *     tags: [Menus]
 *     summary: 获取菜单树形结构
 *     description: 获取菜单的树形结构数据
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

/**
 * @swagger
 * /admin/menus/{id}:
 *   get:
 *     tags: [Menus]
 *     summary: 获取菜单详情
 *     description: 根据ID获取菜单详情
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 菜单ID
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
 * /admin/menus:
 *   post:
 *     tags: [Menus]
 *     summary: 创建菜单
 *     description: 创建新菜单
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 description: 菜单标题
 *               alias:
 *                 type: string
 *                 description: 菜单别名
 *               parent_id:
 *                 type: integer
 *                 description: 父菜单ID
 *               url:
 *                 type: string
 *                 description: 菜单链接
 *               icon:
 *                 type: string
 *                 description: 菜单图标
 *               sort:
 *                 type: integer
 *                 description: 排序
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
 * /admin/menus/{id}:
 *   put:
 *     tags: [Menus]
 *     summary: 更新菜单
 *     description: 根据ID更新菜单信息
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 菜单ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 菜单标题
 *               alias:
 *                 type: string
 *                 description: 菜单别名
 *               parent_id:
 *                 type: integer
 *                 description: 父菜单ID
 *               url:
 *                 type: string
 *                 description: 菜单链接
 *               icon:
 *                 type: string
 *                 description: 菜单图标
 *               sort:
 *                 type: integer
 *                 description: 排序
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
 * /admin/menus/{id}:
 *   delete:
 *     tags: [Menus]
 *     summary: 删除菜单
 *     description: 根据ID删除菜单（软删除）
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 菜单ID
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

export default {};
