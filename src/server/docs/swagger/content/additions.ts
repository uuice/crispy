/**
 * ADDITION ROUTES 模块 Swagger 文档
 *
 * 此文件包含 addition routes 相关的所有 API 文档
 * 自动生成
 */

/**
 * @swagger
 * /content/additions:
 *   get:
 *     tags: [ContentAdditions]
 *     summary: 获取附加信息列表
 *     description: 获取附加信息列表
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
 *         name: fields_json
 *         schema:
 *           type: string
 *         description: JSON字段内容（模糊搜索）
 *       - in: query
 *         name: primary_id
 *         schema:
 *           type: integer
 *         description: 主表ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *         description: 状态
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
 * /content/additions/{id}:
 *   get:
 *     tags: [ContentAdditions]
 *     summary: 获取附加信息详情
 *     description: 获取附加信息详情
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
 *         description: 附加信息ID
 *     responses:
 *       200:
 *         description: 操作成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 附加信息不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export default {};
