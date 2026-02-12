/**
 * ADDITIONS 模块 Swagger 文档
 *
 * 此文件包含 additions 相关的所有 API 文档
 * 自动从 routes.ts 文件提取生成
 */

/**
 * @swagger
 * /admin/additions:
 *   get:
 *     tags: [Additions]
 *     summary: 获取附加信息列表
 *     description: 获取附加信息列表，支持分页和搜索
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
 *         name: create_time_start
 *         schema:
 *           type: integer
 *         description: 创建时间起始
 *       - in: query
 *         name: create_time_end
 *         schema:
 *           type: integer
 *         description: 创建时间结束
 *       - in: query
 *         name: update_time_start
 *         schema:
 *           type: integer
 *         description: 更新时间起始
 *       - in: query
 *         name: update_time_end
 *         schema:
 *           type: integer
 *         description: 更新时间结束
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: 请求是否成功
 *                 message:
 *                   type: string
 *                   description: 响应消息
 *                 data:
 *                   type: object
 *                   properties:
 *                     dataList:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Addition'
 *                       description: 附加信息列表
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           description: 总数
 *                         page:
 *                           type: integer
 *                           description: 当前页
 *                         pageSize:
 *                           type: integer
 *                           description: 每页数量
 *                         totalPages:
 *                           type: integer
 *                           description: 总页数
 *                       description: 分页信息
 *                   description: 返回的数据
 */

/**
 * @swagger
 * /admin/additions/{id}:
 *   get:
 *     tags: [Additions]
 *     summary: 获取附加信息详情
 *     description: 根据ID获取附加信息详情
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 附加信息ID
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: 请求是否成功
 *                 message:
 *                   type: string
 *                   description: 响应消息
 *                 data:
 *                   $ref: '#/components/schemas/Addition'
 *                   description: 附加信息数据
 *       404:
 *         description: 附加信息不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /admin/additions:
 *   post:
 *     tags: [Additions]
 *     summary: 创建附加信息
 *     description: 创建新附加信息
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [primary_id, fields_json]
 *             properties:
 *               primary_id:
 *                 type: integer
 *                 description: 主表ID
 *               fields_json:
 *                 type: string
 *                 description: JSON格式的扩展字段
 *               status:
 *                 type: integer
 *                 description: 状态，默认10
 *     responses:
 *       200:
 *         description: 创建成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: 请求是否成功
 *                 message:
 *                   type: string
 *                   description: 响应消息
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: 新创建的附加信息ID
 *                   description: 创建结果
 */

/**
 * @swagger
 * /admin/additions/{id}:
 *   put:
 *     tags: [Additions]
 *     summary: 更新附加信息
 *     description: 根据ID更新附加信息
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 附加信息ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               primary_id:
 *                 type: integer
 *                 description: 主表ID
 *               fields_json:
 *                 type: string
 *                 description: JSON格式的扩展字段
 *               status:
 *                 type: integer
 *                 description: 状态
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: 请求是否成功
 *                 message:
 *                   type: string
 *                   description: 响应消息
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: 更新的附加信息ID
 *                   description: 更新结果
 */

/**
 * @swagger
 * /admin/additions/{id}:
 *   delete:
 *     tags: [Additions]
 *     summary: 删除附加信息
 *     description: 根据ID删除附加信息（软删除）
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 附加信息ID
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: 请求是否成功
 *                 message:
 *                   type: string
 *                   description: 响应消息
 *                 data:
 *                   type: object
 *                   description: 删除结果
 */

export default {};
