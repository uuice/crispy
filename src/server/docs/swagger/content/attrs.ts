/**
 * ATTRS ROUTES 模块 Swagger 文档
 * 
 * 此文件包含 attrs routes 相关的所有 API 文档
 * 自动生成
 */

/**
 * @swagger
 * /content/attrs:
 *   get:
 *     tags: [ContentAttrs]
 *     summary: 获取属性列表
 *     description: 获取属性列表
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
 * /content/attrs/{id}:
 *   get:
 *     tags: [ContentAttrs]
 *     summary: 获取属性详情
 *     description: 获取属性详情
 *     security:
 *       - accessTokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 属性ID
 *     responses:
 *       200:
 *         description: 操作成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 属性不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export default {};
