/**
 * RULE ROUTES 模块 Swagger 文档
 *
 * 此文件包含 rule routes 相关的所有 API 文档
 * 自动生成
 */

/**
 * @swagger
 * /content/rules:
 *   get:
 *     tags: [ContentRules]
 *     summary: 获取规则列表
 *     description: 获取规则列表
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
 *         description: 规则名称（模糊搜索）
 *       - in: query
 *         name: alias
 *         schema:
 *           type: string
 *         description: 规则别名（模糊搜索）
 *       - in: query
 *         name: condition
 *         schema:
 *           type: string
 *         description: 规则条件（模糊搜索）
 *       - in: query
 *         name: des
 *         schema:
 *           type: string
 *         description: 规则描述（模糊搜索）
 *       - in: query
 *         name: icon
 *         schema:
 *           type: string
 *         description: 规则图标（模糊搜索）
 *       - in: query
 *         name: module_id
 *         schema:
 *           type: integer
 *         description: 模块ID
 *       - in: query
 *         name: parent_id
 *         schema:
 *           type: integer
 *         description: 父规则ID
 *       - in: query
 *         name: sort
 *         schema:
 *           type: integer
 *         description: 排序值
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *         description: 规则状态
 *       - in: query
 *         name: type_id
 *         schema:
 *           type: integer
 *         description: 规则类型ID
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
 * /content/rules/tree:
 *   get:
 *     tags: [ContentRules]
 *     summary: 获取规则树形结构
 *     description: 获取规则树形结构
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
 * /content/rules/{id}:
 *   get:
 *     tags: [ContentRules]
 *     summary: 获取规则详情
 *     description: 获取规则详情
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
 *         description: 规则ID
 *     responses:
 *       200:
 *         description: 操作成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 规则不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export default {};
