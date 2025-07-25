/**
 * @swagger
 * /content/search/articles:
 *   get:
 *     tags: [Search]
 *     summary: 全文检索文章
 *     description: 根据关键词进行文章的全文检索
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: 检索关键词
 *     responses:
 *       200:
 *         description: 检索成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
/**
 * @swagger
 * /content/search/pages:
 *   get:
 *     tags: [Search]
 *     summary: 全文检索页面
 *     description: 根据关键词进行页面的全文检索
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: 检索关键词
 *     responses:
 *       200:
 *         description: 检索成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
/**
 * @swagger
 * /content/search/daily:
 *   get:
 *     tags: [Search]
 *     summary: 全文检索每日类库
 *     description: 根据关键词检索每日类库文章
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: 检索关键词
 *     responses:
 *       200:
 *         description: 检索成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
