/**
 * ROLE ROUTES 模块 Swagger 文档
 *
 * 此文件包含 role routes 相关的所有 API 文档
 * 自动生成
 */

/**
 * @swagger
 * /content/roles:
 *   get:
 *     tags: [ContentRoles]
 *     summary: 获取角色列表
 *     description: 获取角色列表
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
 *         description: 角色标题（模糊搜索）
 *       - in: query
 *         name: des
 *         schema:
 *           type: string
 *         description: 角色描述（模糊搜索）
 *       - in: query
 *         name: module_id
 *         schema:
 *           type: integer
 *         description: 模块ID
 *       - in: query
 *         name: rule_ids
 *         schema:
 *           type: string
 *         description: 规则ID列表（模糊搜索）
 *       - in: query
 *         name: sort
 *         schema:
 *           type: integer
 *         description: 排序值
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *         description: 角色状态
 *       - in: query
 *         name: type_id
 *         schema:
 *           type: integer
 *         description: 角色类型ID
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
 *         description: 操作成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

/**
 * @swagger
 * /content/roles/{id}:
 *   get:
 *     tags: [ContentRoles]
 *     summary: 获取角色详情
 *     description: 获取角色详情
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
 *         description: 角色ID
 *     responses:
 *       200:
 *         description: 操作成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 角色不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export default {};
