import { Router } from 'express'
import { renderTemplate } from '../config/nunjucks'

const router = Router()

/**
 * 演示 Nunjucks 模板渲染
 */
router.get('/template-demo', async (req, res) => {
  try {
    // 模拟博客数据
    const posts = [
      {
        id: 1,
        title: 'Angular SSR 最佳实践',
        slug: 'angular-ssr-best-practices',
        excerpt: '本文介绍了在 Angular 应用中实现服务端渲染的最佳实践和注意事项。',
        content: '详细内容...',
        author: 'Admin',
        category: '技术',
        tags: ['Angular', 'SSR', '前端'],
        created_at: new Date('2024-01-15'),
        updated_at: new Date('2024-01-15')
      },
      {
        id: 2,
        title: 'Nunjucks 模板引擎入门',
        slug: 'nunjucks-template-engine-guide',
        excerpt: '学习如何使用 Nunjucks 模板引擎来构建动态的 HTML 页面。',
        content: '详细内容...',
        author: 'Admin',
        category: '教程',
        tags: ['Nunjucks', '模板', 'Node.js'],
        created_at: new Date('2024-01-10'),
        updated_at: new Date('2024-01-10')
      },
      {
        id: 3,
        title: 'Express.js 中间件详解',
        slug: 'express-middleware-explained',
        excerpt: '深入了解 Express.js 中间件的工作原理和使用方法。',
        content: '详细内容...',
        author: 'Admin',
        category: '后端',
        tags: ['Express', 'Node.js', '中间件'],
        created_at: new Date('2024-01-05'),
        updated_at: new Date('2024-01-05')
      }
    ]

    // 模拟分页数据
    const pagination = {
      currentPage: 1,
      totalPages: 1,
      totalItems: posts.length,
      itemsPerPage: 10,
      hasPrev: false,
      hasNext: false,
      prevPage: null,
      nextPage: null
    }

    // 使用 Express 的 render 方法
    res.render('blog-list.njk', {
      posts,
      pagination,
      currentYear: new Date().getFullYear()
    })
  } catch (error) {
    console.error('Template rendering error:', error)
    res.status(500).send('模板渲染错误')
  }
})

/**
 * 演示使用 renderTemplate 函数
 */
router.get('/template-demo-2', async (req, res) => {
  try {
    const html = await renderTemplate('blog-list.njk', {
      posts: [
        {
          id: 1,
          title: '使用 renderTemplate 函数渲染',
          slug: 'render-template-function',
          excerpt: '这是使用 renderTemplate 函数渲染的示例页面。',
          author: 'System',
          category: '演示',
          tags: ['Demo', 'Template'],
          created_at: new Date()
        }
      ],
      pagination: null,
      currentYear: new Date().getFullYear()
    })

    res.send(html)
  } catch (error) {
    console.error('Template rendering error:', error)
    res.status(500).send('模板渲染错误')
  }
})

/**
 * 演示模板继承和过滤器
 */
router.get('/template-filters', (req, res) => {
  const testData = {
    title: '过滤器演示',
    longText:
      '这是一段很长的文本内容，用来演示 truncate 过滤器的效果。它会被截断到指定的长度，并在末尾添加省略号。',
    htmlContent:
      '<p>这是包含 <strong>HTML 标签</strong> 的内容，用来演示 <em>stripHtml</em> 过滤器。</p>',
    publishDate: new Date('2024-01-15T10:30:00'),
    currentYear: new Date().getFullYear()
  }

  res.render('base.njk', testData)
})

export default router
