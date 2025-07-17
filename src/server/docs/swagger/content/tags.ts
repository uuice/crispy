/**
 * TAG ROUTES 模块 Swagger 文档
 *
 * 此文件包含 tag routes 相关的所有 API 文档
 * 自动生成
 */

/**
 * @swagger
 * /content/tags:
 *   get:
 *     tags: [ContentTags]
 *     summary: 获取标签列表
 *     description: 获取标签列表
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
 *         description: 标签标题（模糊搜索）
 *       - in: query
 *         name: des
 *         schema:
 *           type: string
 *         description: 标签描述（模糊搜索）
 *       - in: query
 *         name: value
 *         schema:
 *           type: string
 *         description: 标签值（模糊搜索）
 *       - in: query
 *         name: sort
 *         schema:
 *           type: integer
 *         description: 排序值
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *         description: 标签状态
 *       - in: query
 *         name: type_id
 *         schema:
 *           type: integer
 *         description: 标签类型ID
 *       - in: query
 *         name: update_time
 *         schema:
 *           type: integer
 *         description: 更新时间戳
 *       - in: query
 *         name: is_delete
 *         schema:
 *           type: integer
 *         description: 删除状态
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
 * /content/tags/{id}:
 *   get:
 *     tags: [ContentTags]
 *     summary: 获取标签详情
 *     description: 获取标签详情
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
 *         description: 标签ID
 *     responses:
 *       200:
 *         description: 操作成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 标签不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export default {};
