/**
 * JOBS 模块 Swagger 文档
 *
 * 此文件包含 jobs 相关的所有 API 文档
 * 自动从 routes.ts 文件提取生成
 */

/**
 * @swagger
 * /admin/jobs:
 *   get:
 *     tags: [Jobs]
 *     summary: 获取任务列表
 *     description: 获取任务列表，支持分页和搜索
 *     security:
 *       - bearerAuth: []
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
 *         name: num_min
 *         schema:
 *           type: integer
 *         description: 最小招聘人数
 *       - in: query
 *         name: num_max
 *         schema:
 *           type: integer
 *         description: 最大招聘人数
 *       - in: query
 *         name: sort
 *         schema:
 *           type: integer
 *         description: 排序值
 *       - in: query
 *         name: sort_min
 *         schema:
 *           type: integer
 *         description: 最小排序值
 *       - in: query
 *         name: sort_max
 *         schema:
 *           type: integer
 *         description: 最大排序值
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
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

/**
 * @swagger
 * /admin/jobs/{id}:
 *   get:
 *     tags: [Jobs]
 *     summary: 获取任务详情
 *     description: 根据ID获取任务详情
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 任务ID
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

/**
 * @swagger
 * /admin/jobs:
 *   post:
 *     tags: [Jobs]
 *     summary: 创建任务
 *     description: 创建新任务
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, command]
 *             properties:
 *               name:
 *                 type: string
 *                 description: 任务名称
 *               command:
 *                 type: string
 *                 description: 执行命令
 *               cron:
 *                 type: string
 *                 description: Cron表达式
 *               status:
 *                 type: integer
 *                 description: 状态
 *     responses:
 *       200:
 *         description: 创建成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

/**
 * @swagger
 * /admin/jobs/{id}:
 *   put:
 *     tags: [Jobs]
 *     summary: 更新任务
 *     description: 根据ID更新任务信息
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 任务ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 任务名称
 *               command:
 *                 type: string
 *                 description: 执行命令
 *               cron:
 *                 type: string
 *                 description: Cron表达式
 *               status:
 *                 type: integer
 *                 description: 状态
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

/**
 * @swagger
 * /admin/jobs/{id}:
 *   delete:
 *     tags: [Jobs]
 *     summary: 删除任务
 *     description: 根据ID删除任务（软删除）
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 任务ID
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

export default {};
