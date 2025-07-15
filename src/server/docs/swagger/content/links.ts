/**
 * LINK ROUTES 模块 Swagger 文档
 *
 * 此文件包含 link routes 相关的所有 API 文档
 * 自动生成
 */

/**
 * @swagger
 * /content/links:
 *   get:
 *     tags: [ContentLinks]
 *     summary: 获取链接列表
 *     description: 获取链接列表
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
 *         name: site_name
 *         schema:
 *           type: string
 *         description: 站点名称（模糊搜索）
 *       - in: query
 *         name: des
 *         schema:
 *           type: string
 *         description: 链接描述（模糊搜索）
 *       - in: query
 *         name: logo
 *         schema:
 *           type: string
 *         description: Logo图标（模糊搜索）
 *       - in: query
 *         name: method
 *         schema:
 *           type: string
 *         description: 打开方式
 *       - in: query
 *         name: type_id
 *         schema:
 *           type: integer
 *         description: 分类ID
 *       - in: query
 *         name: sort
 *         schema:
 *           type: integer
 *         description: 排序值
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *         description: 链接状态
 *       - in: query
 *         name: url
 *         schema:
 *           type: string
 *         description: 链接地址（模糊搜索）
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
 * /content/links/{id}:
 *   get:
 *     tags: [ContentLinks]
 *     summary: 获取链接详情
 *     description: 获取链接详情
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
 *         description: 链接ID
 *     responses:
 *       200:
 *         description: 操作成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 链接不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export default {};
