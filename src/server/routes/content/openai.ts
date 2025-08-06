import { Request, Response, NextFunction } from 'express'
import { openaiService } from '../../services/openaiService'
import { success, error } from '../../utils/response'

// 测试 AI 服务连接
export const testConnection = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const isConnected = await openaiService.testConnection()
    const modelInfo = openaiService.getModelInfo()

    success(res, {
      connected: isConnected,
      configured: modelInfo.configured,
      model: modelInfo.model,
      baseURL: modelInfo.baseURL
    })
  } catch (err: unknown) {
    console.error('Error testing AI connection:', err)
    error(res, 'Failed to test AI connection')
  }
}

// 生成文章摘要
export const generateSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { content, maxLength } = req.body

    if (!content || typeof content !== 'string') {
      error(res, 'Content is required and must be a string', 400)
      return
    }

    const summary = await openaiService.generateArticleSummary(content, maxLength)
    success(res, { summary })
  } catch (err: unknown) {
    console.error('Error generating summary:', err)
    error(res, 'Failed to generate summary')
  }
}

// 生成文章标签
export const generateTags = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, content, maxTags } = req.body

    if (!title || !content || typeof title !== 'string' || typeof content !== 'string') {
      error(res, 'Title and content are required and must be strings', 400)
      return
    }

    const tags = await openaiService.generateArticleTags(title, content, maxTags)
    success(res, { tags })
  } catch (err: unknown) {
    console.error('Error generating tags:', err)
    error(res, 'Failed to generate tags')
  }
}

// 生成 SEO 描述
export const generateSEODescription = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, content, maxLength } = req.body

    if (!title || !content || typeof title !== 'string' || typeof content !== 'string') {
      error(res, 'Title and content are required and must be strings', 400)
      return
    }

    const description = await openaiService.generateSEODescription(title, content, maxLength)
    success(res, { description })
  } catch (err: unknown) {
    console.error('Error generating SEO description:', err)
    error(res, 'Failed to generate SEO description')
  }
}

// 翻译文本
export const translateText = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { text, targetLanguage } = req.body

    if (!text || typeof text !== 'string') {
      error(res, 'Text is required and must be a string', 400)
      return
    }

    const translation = await openaiService.translateText(text, targetLanguage)
    success(res, { translation })
  } catch (err: unknown) {
    console.error('Error translating text:', err)
    error(res, 'Failed to translate text')
  }
}

// 解释代码
export const explainCode = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { code, language } = req.body

    if (!code || typeof code !== 'string') {
      error(res, 'Code is required and must be a string', 400)
      return
    }

    const explanation = await openaiService.explainCode(code, language)
    success(res, { explanation })
  } catch (err: unknown) {
    console.error('Error explaining code:', err)
    error(res, 'Failed to explain code')
  }
}

// 生成标题建议
export const generateTitles = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { content, count } = req.body

    if (!content || typeof content !== 'string') {
      error(res, 'Content is required and must be a string', 400)
      return
    }

    const titles = await openaiService.generateTitleSuggestions(content, count)
    success(res, { titles })
  } catch (err: unknown) {
    console.error('Error generating titles:', err)
    error(res, 'Failed to generate titles')
  }
}

// 通用聊天接口
export const chat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { messages, options } = req.body

    if (!messages || !Array.isArray(messages)) {
      error(res, 'Messages array is required', 400)
      return
    }

    const response = await openaiService.createChatCompletion(messages, options)
    success(res, { response: response.choices[0]?.message?.content || '' })
  } catch (err: unknown) {
    console.error('Error in chat:', err)
    error(res, 'Failed to process chat request')
  }
}

// 导出控制器
export const openaiController = {
  testConnection,
  generateSummary,
  generateTags,
  generateSEODescription,
  translateText,
  explainCode,
  generateTitles,
  chat
}
