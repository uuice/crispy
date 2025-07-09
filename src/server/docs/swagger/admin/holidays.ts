/**
 * HOLIDAYS 模块 Swagger 文档
 * 
 * 此文件包含 holidays 相关的所有 API 文档
 * 自动从 routes.ts 文件提取生成
 */

/**
 * @swagger
 * /admin/holidays:
 *   get:
 *     tags: [Holidays]
 *     summary: 获取节假日列表
 *     description: 获取节假日列表，支持分页和搜索
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
 * /admin/holidays/{id}:
 *   get:
 *     tags: [Holidays]
 *     summary: 获取节假日详情
 *     description: 根据ID获取节假日详情
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 节假日ID
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
 * /admin/holidays:
 *   post:
 *     tags: [Holidays]
 *     summary: 创建节假日
 *     description: 创建新节假日
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, date]
 *             properties:
 *               name:
 *                 type: string
 *                 description: 节假日名称
 *               date:
 *                 type: string
 *                 format: date
 *                 description: 节假日日期
 *               type:
 *                 type: integer
 *                 description: 节假日类型
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
 * /admin/holidays/{id}:
 *   put:
 *     tags: [Holidays]
 *     summary: 更新节假日
 *     description: 根据ID更新节假日信息
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 节假日ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 节假日名称
 *               date:
 *                 type: string
 *                 format: date
 *                 description: 节假日日期
 *               type:
 *                 type: integer
 *                 description: 节假日类型
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
 * /admin/holidays/{id}:
 *   delete:
 *     tags: [Holidays]
 *     summary: 删除节假日
 *     description: 根据ID删除节假日（软删除）
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 节假日ID
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

export default {};
