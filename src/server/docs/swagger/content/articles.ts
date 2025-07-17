/**
 * ARTICLE ROUTES 模块 Swagger 文档
 *
 * 此文件包含 article routes 相关的所有 API 文档
 * 自动生成
 */

/**
 * @swagger
 * /content/articles:
 *   get:
 *     tags: [ContentArticles]
 *     summary: 获取文章列表
 *     description: 获取文章列表
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
 *         description: 文章标题（模糊搜索）
 *       - in: query
 *         name: sub_title
 *         schema:
 *           type: string
 *         description: 副标题（模糊搜索）
 *       - in: query
 *         name: abstract
 *         schema:
 *           type: string
 *         description: 摘要（模糊搜索）
 *       - in: query
 *         name: content
 *         schema:
 *           type: string
 *         description: 内容（模糊搜索）
 *       - in: query
 *         name: author_id
 *         schema:
 *           type: integer
 *         description: 作者ID
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: 用户ID
 *       - in: query
 *         name: type_id
 *         schema:
 *           type: integer
 *         description: 分类ID
 *       - in: query
 *         name: type_ids
 *         schema:
 *           type: string
 *         description: 分类ID列表（逗号分隔）
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *         description: 状态 (10已发布 -10待发布 -100已删除 -20草稿)
 *       - in: query
 *         name: is_review
 *         schema:
 *           type: integer
 *         description: 是否审核 (0-未审核, 1-已审核)
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: 标签（模糊搜索）
 *       - in: query
 *         name: attrs
 *         schema:
 *           type: string
 *         description: 属性（模糊搜索）
 *       - in: query
 *         name: url
 *         schema:
 *           type: string
 *         description: URL（模糊搜索）
 *       - in: query
 *         name: redirect_url
 *         schema:
 *           type: string
 *         description: 重定向URL（模糊搜索）
 *       - in: query
 *         name: image
 *         schema:
 *           type: string
 *         description: 图片（模糊搜索）
 *       - in: query
 *         name: image_list
 *         schema:
 *           type: string
 *         description: 图片列表（模糊搜索）
 *       - in: query
 *         name: seo_title
 *         schema:
 *           type: string
 *         description: SEO标题（模糊搜索）
 *       - in: query
 *         name: seo_description
 *         schema:
 *           type: string
 *         description: SEO描述（模糊搜索）
 *       - in: query
 *         name: seo_keywords
 *         schema:
 *           type: string
 *         description: SEO关键词（模糊搜索）
 *       - in: query
 *         name: remark
 *         schema:
 *           type: string
 *         description: 备注（模糊搜索）
 *       - in: query
 *         name: click
 *         schema:
 *           type: integer
 *         description: 点击量
 *       - in: query
 *         name: sort
 *         schema:
 *           type: integer
 *         description: 排序
 *       - in: query
 *         name: is_delete
 *         schema:
 *           type: integer
 *         description: 是否删除 (0-未删除, 1-已删除)
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
 *       - in: query
 *         name: start_time
 *         schema:
 *           type: integer
 *         description: 开始时间（时间戳）
 *       - in: query
 *         name: end_time
 *         schema:
 *           type: integer
 *         description: 结束时间（时间戳）
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
 * /content/articles/{id}:
 *   get:
 *     tags: [ContentArticles]
 *     summary: 获取文章详情
 *     description: 获取文章详情
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
 *         description: 文章ID
 *     responses:
 *       200:
 *         description: 操作成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 文章不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export default {};
