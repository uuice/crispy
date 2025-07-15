/**
 * USER TYPE ROUTES 模块 Swagger 文档
 *
 * 此文件包含 user type routes 相关的所有 API 文档
 * 自动生成
 */

/**
 * @swagger
 * /content/user-types:
 *   get:
 *     tags: [ContentUserTypes]
 *     summary: 获取用户类型列表
 *     description: 获取用户类型列表
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
 *         name: type_name
 *         schema:
 *           type: string
 *         description: User type name (fuzzy search)
 *       - in: query
 *         name: alias
 *         schema:
 *           type: string
 *         description: User type alias (fuzzy search)
 *       - in: query
 *         name: remark
 *         schema:
 *           type: string
 *         description: User type remark (fuzzy search)
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *         description: User type status
 *       - in: query
 *         name: is_delete
 *         schema:
 *           type: integer
 *         description: Deletion status
 *       - in: query
 *         name: update_time
 *         schema:
 *           type: integer
 *         description: Update timestamp
 *       - in: query
 *         name: create_time
 *         schema:
 *           type: integer
 *         description: Creation timestamp
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
 * /content/user-types/{id}:
 *   get:
 *     tags: [ContentUserTypes]
 *     summary: 获取用户类型详情
 *     description: 获取用户类型详情
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
 *         description: 用户类型ID
 *     responses:
 *       200:
 *         description: 操作成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 用户类型不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export default {};
