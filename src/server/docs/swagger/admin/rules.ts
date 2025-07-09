/**
 * RULES 模块 Swagger 文档
 * 
 * 此文件包含 rules 相关的所有 API 文档
 * 自动从 routes.ts 文件提取生成
 */

/**
 * @swagger
 * /admin/rules:
 *   get:
 *     tags: [Rules]
 *     summary: 获取规则列表
 *     description: 获取规则列表，支持分页和搜索
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
 *         name: search
 *         schema:
 *           type: string
 *         description: 搜索关键词
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
 * /admin/rules/tree:
 *   get:
 *     tags: [Rules]
 *     summary: 获取规则树形结构
 *     description: 获取规则的树形结构数据
 *     security:
 *       - bearerAuth: []
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
 * /admin/rules/{id}:
 *   get:
 *     tags: [Rules]
 *     summary: 获取规则详情
 *     description: 根据ID获取规则详情
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 规则ID
 *     responses:
 *       200:
 *         description: 获取成功
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

/**
 * @swagger
 * /admin/rules:
 *   post:
 *     tags: [Rules]
 *     summary: 创建规则
 *     description: 创建新规则
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, rule]
 *             properties:
 *               name:
 *                 type: string
 *                 description: 规则名称
 *               rule:
 *                 type: string
 *                 description: 规则内容
 *               parent_id:
 *                 type: integer
 *                 description: 父规则ID
 *               description:
 *                 type: string
 *                 description: 规则描述
 *               sort:
 *                 type: integer
 *                 description: 排序
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
 * /admin/rules/{id}:
 *   put:
 *     tags: [Rules]
 *     summary: 更新规则
 *     description: 根据ID更新规则信息
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 规则ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 规则名称
 *               rule:
 *                 type: string
 *                 description: 规则内容
 *               parent_id:
 *                 type: integer
 *                 description: 父规则ID
 *               description:
 *                 type: string
 *                 description: 规则描述
 *               sort:
 *                 type: integer
 *                 description: 排序
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
 * /admin/rules/{id}:
 *   delete:
 *     tags: [Rules]
 *     summary: 删除规则
 *     description: 根据ID删除规则（软删除）
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 规则ID
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

export default {};
