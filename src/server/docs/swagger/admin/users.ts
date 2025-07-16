/**
 * USERS 模块 Swagger 文档
 *
 * 此文件包含 users 相关的所有 API 文档
 * 自动从 routes.ts 文件提取生成
 */

/**
 * @swagger
 * /admin/login:
 *   post:
 *     tags: [Authentication]
 *     summary: 用户登录
 *     description: 用户登录接口，不需要认证
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *                 description: 用户名
 *               password:
 *                 type: string
 *                 description: 密码
 *     responses:
 *       200:
 *         description: 登录成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: 登录失败
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /admin/logout:
 *   post:
 *     tags: [Authentication]
 *     summary: 用户登出
 *     description: 用户登出接口
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 登出成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     tags: [Users]
 *     summary: 获取用户列表
 *     description: 获取用户列表，支持分页和搜索
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
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: 获取用户详情
 *     description: 根据ID获取用户详情
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 用户ID
 *     responses:
 *       200:
 *         description: 获取成功
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

/**
 * @swagger
 * /admin/users:
 *   post:
 *     tags: [Users]
 *     summary: 创建用户
 *     description: 创建新用户
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password, email]
 *             properties:
 *               username:
 *                 type: string
 *                 description: 用户名
 *               password:
 *                 type: string
 *                 description: 密码
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 邮箱
 *               role:
 *                 type: string
 *                 description: 角色
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
 * /admin/users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: 更新用户
 *     description: 根据ID更新用户信息
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 用户ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: 用户名
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 邮箱
 *               role:
 *                 type: string
 *                 description: 角色
 *     responses:
 *       200:
 *         description: 更新成功
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

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: 删除用户
 *     description: 根据ID删除用户（软删除）
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 用户ID
 *     responses:
 *       200:
 *         description: 删除成功
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

/**
 * @swagger
 * /admin/users/{id}/reset-password:
 *   post:
 *     tags: [Users]
 *     summary: 重置用户密码
 *     description: 重置指定用户的密码
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 用户ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               password:
 *                 type: string
 *                 description: 新密码
 *     responses:
 *       200:
 *         description: 重置成功
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
