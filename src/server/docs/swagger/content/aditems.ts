/**
 * AD ITEM ROUTES 模块 Swagger 文档
 *
 * 此文件包含 ad item routes 相关的所有 API 文档
 * 自动生成
 */

/**
 * @swagger
 * /content/ad-items:
 *   get:
 *     tags: [ContentAdItems]
 *     summary: 获取广告项目列表
 *     description: 获取广告项目列表
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
 *         name: ad_id
 *         schema:
 *           type: integer
 *         description: 广告ID过滤
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: 广告项目标题（模糊搜索）
 *       - in: query
 *         name: content
 *         schema:
 *           type: string
 *         description: 广告项目内容（模糊搜索）
 *       - in: query
 *         name: image_url
 *         schema:
 *           type: string
 *         description: 图片URL（模糊搜索）
 *       - in: query
 *         name: url
 *         schema:
 *           type: string
 *         description: 链接地址（模糊搜索）
 *       - in: query
 *         name: method
 *         schema:
 *           type: string
 *         description: 打开方式
 *       - in: query
 *         name: sort
 *         schema:
 *           type: integer
 *         description: 排序值
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *         description: 状态过滤
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
 * /content/ad-items/{id}:
 *   get:
 *     tags: [ContentAdItems]
 *     summary: 获取广告项目详情
 *     description: 获取广告项目详情
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
 *         description: 广告项目ID
 *     responses:
 *       200:
 *         description: 操作成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 广告项目不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export default {};
