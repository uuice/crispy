// Generate JavaScript article every 2 hours
import { openaiService } from '../server/services/openaiService'
import { articleService } from '../server/services/articleService'
import { marked } from 'marked'

// Markdown to HTML converter using marked
async function markdownToHtml(markdown: string): Promise<string> {
  try {
    // Use marked with options directly in parse call
    const html = await marked.parse(markdown, {
      breaks: true, // Convert \n to <br>
      gfm: true // Enable GitHub Flavored Markdown
    })

    // Post-process the HTML to add target="_blank" to external links
    const processedHtml = html.replace(
      /<a href="(https?:\/\/[^"]+)"([^>]*)>/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer"$2>'
    )

    return processedHtml
  } catch (error) {
    console.error('Failed to parse markdown:', error)
    // Fallback: return the original markdown wrapped in <pre>
    return `<pre>${markdown}</pre>`
  }
}

// JavaScript topics pool for random selection
const jsTopics = [
  'JavaScript ES6+ 新特性',
  'JavaScript 异步编程',
  'JavaScript 闭包和作用域',
  'JavaScript 原型链和继承',
  'JavaScript 事件循环机制',
  'JavaScript Promise 和 async/await',
  'JavaScript 数组方法详解',
  'JavaScript 对象操作技巧',
  'JavaScript 函数式编程',
  'JavaScript 模块化开发',
  'JavaScript 正则表达式',
  'JavaScript DOM 操作',
  'JavaScript 性能优化',
  'JavaScript 错误处理',
  'JavaScript 设计模式',
  'JavaScript Web API',
  'JavaScript 内存管理',
  'JavaScript 调试技巧',
  'JavaScript 测试方法',
  'JavaScript 框架对比',
  'JavaScript TypeScript 入门',
  'JavaScript Node.js 基础',
  'JavaScript Webpack 配置',
  'JavaScript Babel 使用',
  'JavaScript 前端工程化'
]

// Get random topic from the pool
function getRandomTopic(): string {
  const randomIndex = Math.floor(Math.random() * jsTopics.length)
  return jsTopics[randomIndex]
}

// Generate article content using AI
async function generateArticleContent(topic: string) {
  if (!openaiService.isConfigured()) {
    console.log('[JS Article Generator] OpenAI service not configured, skipping article generation')
    return null
  }

  try {
    console.log(`[JS Article Generator] Generating article for topic: ${topic}`)

    // Generate title suggestions
    const titleSystemPrompt = `你是一个专业的JavaScript技术博客标题创作专家。你的任务是为技术文章创作吸引人的标题。你擅长：
1. 使用准确的技术术语
2. 创作简洁有力的标题
3. 吸引开发者的注意力
4. 避免标题党和夸大其词`

    const titlePrompt = `为JavaScript技术博客生成一个关于"${topic}"的吸引人的标题，要求：
1. 标题简洁有力，不超过30字
2. 包含关键技术词汇
3. 能够吸引开发者点击
4. 只返回一个最佳标题，不要编号`

    const title = await openaiService.generateCompletion(titlePrompt, titleSystemPrompt, {
      max_tokens: 100,
      temperature: 0.8
    })

    // Generate abstract
    const abstractSystemPrompt = `你是一个专业的技术文章摘要撰写专家。你的任务是为JavaScript技术文章创作简洁明了的摘要。你擅长：
1. 快速提炼文章核心价值
2. 用简洁的语言概括复杂概念
3. 突出文章的实用性和学习价值
4. 激发读者的阅读兴趣`

    const abstractPrompt = `为JavaScript技术文章"${title}"生成一个简洁的摘要，要求：
1. 150字以内
2. 概括文章核心内容
3. 突出实用价值
4. 吸引读者继续阅读`

    const abstract = await openaiService.generateCompletion(abstractPrompt, abstractSystemPrompt, {
      max_tokens: 200,
      temperature: 0.6
    })

    // Generate markdown content
    const contentSystemPrompt = `你是一个资深的JavaScript技术博客作者和教学专家。你有丰富的前端开发经验和技术写作能力。你擅长：
1. 将复杂的技术概念用通俗易懂的方式解释
2. 编写高质量的代码示例和详细注释
3. 结合实际开发场景讲解技术应用
4. 使用清晰的Markdown格式组织文章结构
5. 为中级JavaScript开发者提供有价值的学习内容`

    const contentPrompt = `写一篇关于"${title}"的详细技术文章，要求：
1. 使用Markdown格式
2. 包含代码示例
3. 结构清晰，有标题层级
4. 内容实用，适合中级JavaScript开发者
5. 字数在1500-2500字
6. 包含实际应用场景
7. 代码示例要完整可运行

文章结构建议：
- 简介
- 核心概念解释
- 代码示例和解析
- 实际应用场景
- 最佳实践
- 总结`

    const markdownContent = await openaiService.generateCompletion(
      contentPrompt,
      contentSystemPrompt,
      {
        max_tokens: 4000,
        temperature: 0.7
      }
    )

    // Generate tags
    const tagsSystemPrompt = `你是一个专业的技术内容标签分类专家。你精通JavaScript生态系统和前端技术栈，能够准确识别技术文章的核心主题和相关技术。你擅长：
1. 识别文章的核心技术概念
2. 选择最相关和最有价值的标签
3. 使用开发者熟悉的技术术语
4. 平衡通用性和专业性`

    const tagsPrompt = `为JavaScript技术文章"${title}"生成10个相关标签，要求：
1. 标签要准确反映文章内容
2. 包含技术关键词
3. 用逗号分隔
4. 适合技术博客分类`

    const tagsResponse = await openaiService.generateCompletion(tagsPrompt, tagsSystemPrompt, {
      max_tokens: 100,
      temperature: 0.5
    })

    const tags = tagsResponse
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, 10)
      .join(',')

    // Convert Markdown to HTML
    const htmlContent = await markdownToHtml(markdownContent.trim())

    return {
      title: `[AI生成] ${title.trim()}`,
      abstract: abstract.trim(),
      content: htmlContent, // HTML format for display
      markdown_content: markdownContent.trim(), // Original Markdown for editing
      tags: tags
    }
  } catch (error) {
    console.error('[JS Article Generator] Failed to generate article content:', error)
    return null
  }
}

// Main function to generate and save article
async function generateAndSaveArticle(): Promise<any> {
  try {
    console.log('[JS Article Generator] Starting article generation...')

    // Get random topic
    const topic = getRandomTopic()

    // Generate article content
    const articleData = await generateArticleContent(topic)

    if (!articleData) {
      console.log('[JS Article Generator] Failed to generate article content')
      return null
    }

    // Prepare article data for database
    const createData = {
      title: articleData.title,
      abstract: articleData.abstract,
      content: articleData.content,
      markdown_content: articleData.markdown_content,
      is_markdown: 1, // Mark as markdown content
      tags: articleData.tags,
      type_id: 9, // Assuming category ID 1 for JavaScript articles, adjust as needed
      status: 10, // Published status
      user_id: 1, // System user ID, adjust as needed
      author_id: 1, // System author ID, adjust as needed
      seo_title: articleData.title,
      seo_description: articleData.abstract,
      seo_keywords: articleData.tags.replace(/,/g, ', '),
      remark: 'Auto-generated JavaScript article'
    }

    // Save to database
    const result = await articleService.createArticle(createData)

    console.log(
      `[JS Article Generator] Successfully created article: "${articleData.title}" (ID: ${result.id})`
    )

    return result
  } catch (error) {
    console.error('[JS Article Generator] Error generating article:', error)
    return null
  }
}

// Run immediately on startup (optional)
// generateAndSaveArticle()

// Schedule to run every 2 hours (7200000 ms) - REMOVED: Now controlled by server.ts
// setInterval(
//   async () => {
//     await generateAndSaveArticle()
//   },
//   1 * 60 * 60 * 1000 // 1 hours
// )

// console.log('[JS Article Generator] Scheduled to run every 1 hours')

// Export for manual execution if needed
export { generateAndSaveArticle, getRandomTopic, generateArticleContent }
