/**
 * CACHES 模块 Swagger 文档
 *
 * 此文件包含 caches 相关的所有 API 文档
 * 自动从 routes.ts 文件提取生成
 */

/**
 * @swagger
 * /admin/caches:
 *   get:
 *     tags: [Caches]
 *     summary: 获取缓存列表
 *     description: 获取缓存列表，支持分页
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
 *         name: hash
 *         schema:
 *           type: string
 *         description: 缓存哈希（模糊搜索）
 *       - in: query
 *         name: cache_data
 *         schema:
 *           type: string
 *         description: 缓存内容（模糊搜索）
 *       - in: query
 *         name: status
 *         schema:
 *           type: integer
 *         description: 缓存状态
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
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

/**
 * @swagger
 * /admin/caches/{id}:
 *   get:
 *     tags: [Caches]
 *     summary: 获取缓存详情
 *     description: 根据ID获取缓存详情
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 缓存ID
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
 * /admin/caches:
 *   post:
 *     tags: [Caches]
 *     summary: 创建缓存
 *     description: 创建新缓存项
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [key, value]
 *             properties:
 *               key:
 *                 type: string
 *                 description: 缓存键
 *               value:
 *                 type: string
 *                 description: 缓存值
 *               expire_time:
 *                 type: integer
 *                 description: 过期时间（秒）
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
 * /admin/caches/{id}:
 *   put:
 *     tags: [Caches]
 *     summary: 更新缓存
 *     description: 根据ID更新缓存信息
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 缓存ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *                 description: 缓存键
 *               value:
 *                 type: string
 *                 description: 缓存值
 *               expire_time:
 *                 type: integer
 *                 description: 过期时间（秒）
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
 * /admin/caches/{id}:
 *   delete:
 *     tags: [Caches]
 *     summary: 删除缓存
 *     description: 根据ID删除缓存项
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 缓存ID
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

/**
 * @swagger
 * /admin/page-cache/stats:
 *   get:
 *     tags: [PageCache]
 *     summary: 获取页面数据库缓存统计信息
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
 * /admin/page-cache/database/list:
 *   get:
 *     tags: [PageCache]
 *     summary: 获取数据库缓存列表
 *     description: 获取所有页面数据库缓存的列表
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
 * /admin/page-cache/database/{hash}:
 *   get:
 *     tags: [PageCache]
 *     summary: 获取指定数据库缓存详情
 *     description: 根据 hash 获取页面数据库缓存详情
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hash
 *         required: true
 *         schema:
 *           type: string
 *         description: 缓存哈希
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *   delete:
 *     tags: [PageCache]
 *     summary: 删除指定数据库缓存
 *     description: 根据 hash 删除页面数据库缓存
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hash
 *         required: true
 *         schema:
 *           type: string
 *         description: 缓存哈希
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
/**
 * @swagger
 * /admin/page-cache/database/cleanup:
 *   post:
 *     tags: [PageCache]
 *     summary: 清理过期数据库缓存
 *     description: 清理所有过期的页面数据库缓存
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 清理成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

export default {};
