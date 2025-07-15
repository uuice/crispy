/**
 * MENU ROUTES 模块 Swagger 文档
 *
 * 此文件包含 menu routes 相关的所有 API 文档
 * 自动生成
 */

/**
 * @swagger
 * /content/menus:
 *   get:
 *     tags: [ContentMenus]
 *     summary: 获取菜单列表
 *     description: 获取菜单列表
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
 *         description: 操作成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

/**
 * @swagger
 * /content/menus/tree:
 *   get:
 *     tags: [ContentMenus]
 *     summary: 获取菜单树形结构
 *     description: 获取菜单树形结构
 *     security:
 *       - accessTokenAuth: []
 *         appNameAuth: []
 *         channelAuth: []
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
 * /content/menus/{id}:
 *   get:
 *     tags: [ContentMenus]
 *     summary: 获取菜单详情
 *     description: 获取菜单详情
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
 *         description: 菜单ID
 *     responses:
 *       200:
 *         description: 操作成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 菜单不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export default {};
