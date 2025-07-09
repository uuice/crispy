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
 *         name: search
 *         schema:
 *           type: string
 *         description: 搜索关键词
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
