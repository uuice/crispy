/**
 * DASHBOARD 模块 Swagger 文档
 * 
 * 此文件包含 dashboard 相关的所有 API 文档
 * 自动从 routes.ts 文件提取生成
 */

/**
 * @swagger
 * /admin/dashboard/overview:
 *   get:
 *     tags: [Dashboard]
 *     summary: 获取仪表板概览
 *     description: 获取仪表板概览数据，包括统计信息和图表数据
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
 *                     stats:
 *                       type: object
 *                       description: 统计数据
 *                       properties:
 *                         totalUsers:
 *                           type: integer
 *                           description: 总用户数
 *                         totalArticles:
 *                           type: integer
 *                           description: 总文章数
 *                         totalViews:
 *                           type: integer
 *                           description: 总访问量
 *                     charts:
 *                       type: object
 *                       description: 图表数据
 */

export default {};
