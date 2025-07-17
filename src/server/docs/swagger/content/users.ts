/**
 * USER ROUTES 模块 Swagger 文档
 *
 * 此文件包含 user routes 相关的所有 API 文档
 * 自动生成
 */

/**
 * @swagger
 * /content/users:
 *   get:
 *     tags: [ContentUsers]
 *     summary: 获取用户列表
 *     description: 获取用户列表
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
 *         name: user_name
 *         schema:
 *           type: string
 *         description: 用户名（模糊搜索）
 *       - in: query
 *         name: real_name
 *         schema:
 *           type: string
 *         description: 真实姓名（模糊搜索）
 *       - in: query
 *         name: nick_name
 *         schema:
 *           type: string
 *         description: 昵称（模糊搜索）
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: 邮箱（模糊搜索）
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *         description: 手机号（模糊搜索）
 *       - in: query
 *         name: avatar_url
 *         schema:
 *           type: string
 *         description: 头像URL（模糊搜索）
 *       - in: query
 *         name: password
 *         schema:
 *           type: string
 *         description: 密码（模糊搜索）
 *       - in: query
 *         name: role_id
 *         schema:
 *           type: integer
 *         description: 角色ID
 *       - in: query
 *         name: type_id
 *         schema:
 *           type: integer
 *         description: 用户类型ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *         description: 状态 (-10-禁用, 10-启用)
 *       - in: query
 *         name: is_admin
 *         schema:
 *           type: integer
 *         description: 是否管理员 (0-否, 1-是)
 *       - in: query
 *         name: is_super_admin
 *         schema:
 *           type: integer
 *         description: 是否超级管理员 (0-否, 1-是)
 *       - in: query
 *         name: is_black
 *         schema:
 *           type: integer
 *         description: 是否黑名单 (0-否, 1-是)
 *       - in: query
 *         name: is_delete
 *         schema:
 *           type: integer
 *         description: 是否删除 (0-未删除, 1-已删除)
 *       - in: query
 *         name: last_login_ip
 *         schema:
 *           type: string
 *         description: 最后登录IP（模糊搜索）
 *       - in: query
 *         name: last_login_time
 *         schema:
 *           type: integer
 *         description: 最后登录时间（时间戳）
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
 * /content/users/{id}:
 *   get:
 *     tags: [ContentUsers]
 *     summary: 获取用户详情
 *     description: 获取用户详情
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
 *         description: 用户ID
 *     responses:
 *       200:
 *         description: 操作成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 用户不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export default {};
