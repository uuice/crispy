/**
 * JOB ROUTES 模块 Swagger 文档
 *
 * 此文件包含 job routes 相关的所有 API 文档
 * 自动生成
 */

/**
 * @swagger
 * /content/jobs:
 *   get:
 *     tags: [ContentJobs]
 *     summary: 获取任务列表
 *     description: 获取任务列表
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
 *         description: 职位名称（模糊搜索）
 *       - in: query
 *         name: typeName
 *         schema:
 *           type: string
 *         description: 职位类别（模糊搜索）
 *       - in: query
 *         name: nature
 *         schema:
 *           type: string
 *         description: 工作性质（模糊搜索）
 *       - in: query
 *         name: branch
 *         schema:
 *           type: string
 *         description: 所在部门（模糊搜索）
 *       - in: query
 *         name: address
 *         schema:
 *           type: string
 *         description: 工作地址（模糊搜索）
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: 简历发送邮箱（模糊搜索）
 *       - in: query
 *         name: content
 *         schema:
 *           type: string
 *         description: 招聘信息（模糊搜索）
 *       - in: query
 *         name: num
 *         schema:
 *           type: integer
 *         description: 招聘人数
 *       - in: query
 *         name: sort
 *         schema:
 *           type: integer
 *         description: 排序值
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
 * /content/jobs/{id}:
 *   get:
 *     tags: [ContentJobs]
 *     summary: 获取任务详情
 *     description: 获取任务详情
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
 *         description: 任务ID
 *     responses:
 *       200:
 *         description: 操作成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 任务不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export default {};
