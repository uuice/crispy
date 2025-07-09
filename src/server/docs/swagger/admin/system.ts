/**
 * SYSTEM 模块 Swagger 文档
 * 
 * 此文件包含 system 相关的所有 API 文档
 * 自动从 routes.ts 文件提取生成
 */

/**
 * @swagger
 * /admin/system/getSystemInfo:
 *   get:
 *     tags: [System]
 *     summary: 获取系统信息
 *     description: 获取服务器系统信息，包括CPU、内存、磁盘等
 *     security:
 *       - bearerAuth: []
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
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "获取成功"
 *                 data:
 *                   type: object
 *                   properties:
 *                     cpu:
 *                       type: object
 *                       description: CPU信息
 *                     memory:
 *                       type: object
 *                       description: 内存信息
 *                     disk:
 *                       type: object
 *                       description: 磁盘信息
 *                     os:
 *                       type: object
 *                       description: 操作系统信息
 */

export default {};
