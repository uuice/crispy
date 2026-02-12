import express from 'express'
import { useJSXEngine } from './libs/express_jsx'

// 创建 Express 应用
const app = express()
const port = 3000

// 使用 JSX 模板引擎
const jsxEngine = useJSXEngine(app, {
  viewsDir: './src/views',
  extension: '.tsx',
  cache: true
})

// 中间件
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 路由处理
app.get('/', async (req, res) => {
  try {
    await res.renderJSX('HomePage', {
      title: '欢迎来到 JSX 模板引擎测试',
      message: '这是一个基于 React JSX 和 Express 的模板引擎示例'
    })
  } catch (error) {
    console.error('Render error:', error)
    res.status(500).json({ error: 'Failed to render template' })
  }
})

app.get('/about', async (req, res) => {
  try {
    const name = (req.query['name'] as string) || '访客'
    await res.renderJSX('AboutPage', { name })
  } catch (error) {
    console.error('Render error:', error)
    res.status(500).json({ error: 'Failed to render template' })
  }
})

// API 路由示例
app.get('/api/info', (req, res) => {
  res.json({
    message: 'JSX 模板引擎服务运行中',
    timestamp: new Date().toISOString(),
    engine: 'Express + React JSX'
  })
})

// 404 处理
app.use(async (req, res) => {
  try {
    await res.renderJSX('NotFoundPage')
  } catch (error) {
    console.error('404 render error:', error)
    res.status(404).json({ error: 'Page not found' })
  }
})

// 错误处理
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Error:', err)
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  })
})

// 启动服务器
app.listen(port, () => {
  console.log(`🚀 JSX 模板引擎测试服务器启动成功!`)
  console.log(`📄 访问地址: http://localhost:${port}`)
  console.log(`🔧 API 测试: http://localhost:${port}/api/info`)
  console.log(`📖 关于页面: http://localhost:${port}/about?name=测试用户`)
})

export default app
