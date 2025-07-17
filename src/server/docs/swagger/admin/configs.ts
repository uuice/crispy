/**
 * CONFIGS 模块 Swagger 文档
 *
 * 此文件包含 configs 相关的所有 API 文档
 * 自动从 routes.ts 文件提取生成
 */

/**
 * @swagger
 * /admin/configs:
 *   get:
 *     tags: [Configs]
 *     summary: 获取配置列表
 *     description: 获取配置列表，支持分页和搜索
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
 *         description: 配置标题（模糊搜索）
 *       - in: query
 *         name: alias
 *         schema:
 *           type: string
 *         description: 配置别名（模糊搜索）
 *       - in: query
 *         name: type_id
 *         schema:
 *           type: integer
 *         description: 配置类型ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *         description: 配置状态
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
 * /admin/configs/alias/{alias}:
 *   get:
 *     tags: [Configs]
 *     summary: 根据别名获取配置
 *     description: 根据别名获取配置信息
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         schema:
 *           type: string
 *         description: 配置别名
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 配置不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /admin/configs/{id}:
 *   get:
 *     tags: [Configs]
 *     summary: 获取配置详情
 *     description: 根据ID获取配置详情
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 配置ID
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 配置不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /admin/configs:
 *   post:
 *     tags: [Configs]
 *     summary: 创建配置
 *     description: 创建新配置项
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, alias, value]
 *             properties:
 *               title:
 *                 type: string
 *                 description: 配置标题
 *               alias:
 *                 type: string
 *                 description: 配置别名
 *               value:
 *                 type: string
 *                 description: 配置值
 *               description:
 *                 type: string
 *                 description: 配置描述
 *               type:
 *                 type: string
 *                 description: 配置类型
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
 *       400:
 *         description: 参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /admin/configs/upsert:
 *   post:
 *     tags: [Configs]
 *     summary: 创建或更新配置
 *     description: 根据别名创建或更新配置项
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [alias, value]
 *             properties:
 *               alias:
 *                 type: string
 *                 description: 配置别名
 *               value:
 *                 type: string
 *                 description: 配置值
 *               title:
 *                 type: string
 *                 description: 配置标题
 *               description:
 *                 type: string
 *                 description: 配置描述
 *               type:
 *                 type: string
 *                 description: 配置类型
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
 * /admin/configs/{id}:
 *   put:
 *     tags: [Configs]
 *     summary: 更新配置
 *     description: 根据ID更新配置信息
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 配置ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 配置标题
 *               alias:
 *                 type: string
 *                 description: 配置别名
 *               value:
 *                 type: string
 *                 description: 配置值
 *               description:
 *                 type: string
 *                 description: 配置描述
 *               type:
 *                 type: string
 *                 description: 配置类型
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
 *       404:
 *         description: 配置不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /admin/configs/{id}:
 *   delete:
 *     tags: [Configs]
 *     summary: 删除配置
 *     description: 根据ID删除配置（软删除）
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 配置ID
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: 配置不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

export default {};
