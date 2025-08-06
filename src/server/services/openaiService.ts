import OpenAI from 'openai'

// Type aliases for better readability
export type OpenAIMessage = OpenAI.ChatCompletionMessageParam
export type OpenAICompletionResponse = OpenAI.ChatCompletion
export type OpenAIStreamChunk = OpenAI.ChatCompletionChunk

export class OpenAIService {
  private client: OpenAI
  private model: string

  constructor() {
    // DeepSeek API configuration (compatible with OpenAI API)
    const apiKey = process.env['DEEPSEEK_API_KEY'] || process.env['OPENAI_API_KEY'] || ''
    const baseURL = process.env['DEEPSEEK_BASE_URL'] || 'https://api.deepseek.com/v1'
    this.model = process.env['DEEPSEEK_MODEL'] || 'deepseek-chat'

    if (!apiKey) {
      console.warn('OpenAI/DeepSeek API key not configured')
    }

    this.client = new OpenAI({
      apiKey,
      baseURL
    })
  }

  /**
   * Create chat completion
   */
  async createChatCompletion(
    messages: OpenAIMessage[],
    options?: Partial<OpenAI.ChatCompletionCreateParams>
  ): Promise<OpenAICompletionResponse> {
    try {
      const response = (await this.client.chat.completions.create({
        model: this.model,
        messages,
        max_tokens: 2000,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        ...options,
        stream: false // Explicitly ensure non-streaming
      })) as OpenAI.ChatCompletion

      return response
    } catch (error: any) {
      console.error('OpenAI API error:', error.message)
      throw new Error(`OpenAI API call failed: ${error.message}`)
    }
  }

  /**
   * Create streaming chat completion
   */
  async createStreamingChatCompletion(
    messages: OpenAIMessage[],
    onChunk: (chunk: OpenAIStreamChunk) => void,
    options?: Partial<OpenAI.ChatCompletionCreateParams>
  ): Promise<void> {
    try {
      const stream = (await this.client.chat.completions.create({
        model: this.model,
        messages,
        max_tokens: 2000,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        ...options,
        stream: true // Explicitly ensure streaming
      })) as AsyncIterable<OpenAI.ChatCompletionChunk>

      for await (const chunk of stream) {
        onChunk(chunk)
      }
    } catch (error: any) {
      console.error('OpenAI streaming API error:', error.message)
      throw new Error(`OpenAI streaming API call failed: ${error.message}`)
    }
  }

  /**
   * Generate text completion
   */
  async generateCompletion(
    prompt: string,
    systemPrompt?: string,
    options?: Partial<OpenAI.ChatCompletionCreateParams>
  ): Promise<string> {
    const messages: OpenAIMessage[] = []

    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt })
    }

    messages.push({ role: 'user', content: prompt })

    const response = await this.createChatCompletion(messages, options)

    return response.choices[0]?.message?.content || ''
  }

  /**
   * Generate article summary
   */
  async generateArticleSummary(content: string, maxLength = 200): Promise<string> {
    const systemPrompt = `你是一个专业的文章摘要生成器。请为给定的文章内容生成一个简洁明了的摘要，长度控制在${maxLength}字以内。摘要应该包含文章的核心内容和主要观点。`

    const userPrompt = `请为以下文章生成摘要：\n\n${content}`

    return await this.generateCompletion(userPrompt, systemPrompt, {
      max_tokens: Math.max(maxLength * 2, 500),
      temperature: 0.3
    })
  }

  /**
   * Generate article tags
   */
  async generateArticleTags(title: string, content: string, maxTags = 5): Promise<string[]> {
    const systemPrompt = `你是一个专业的文章标签生成器。请根据文章标题和内容，生成${maxTags}个相关的标签。标签应该准确反映文章的主题和内容，用逗号分隔返回。`

    const userPrompt = `文章标题：${title}\n\n文章内容：${content}\n\n请生成相关标签：`

    const response = await this.generateCompletion(userPrompt, systemPrompt, {
      max_tokens: 200,
      temperature: 0.3
    })

    return response
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, maxTags)
  }

  /**
   * Generate SEO description
   */
  async generateSEODescription(title: string, content: string, maxLength = 160): Promise<string> {
    const systemPrompt = `你是一个专业的SEO描述生成器。请根据文章标题和内容，生成一个适合搜索引擎优化的描述，长度控制在${maxLength}字以内。描述应该包含关键词，吸引用户点击。`

    const userPrompt = `文章标题：${title}\n\n文章内容：${content}\n\n请生成SEO描述：`

    return await this.generateCompletion(userPrompt, systemPrompt, {
      max_tokens: Math.max(maxLength * 2, 300),
      temperature: 0.3
    })
  }

  /**
   * Translate text
   */
  async translateText(text: string, targetLanguage = 'Chinese'): Promise<string> {
    const systemPrompt = `你是一个专业的翻译器。请将给定的文本翻译成${targetLanguage}，保持原文的语气和风格。`

    const userPrompt = `请翻译以下文本：\n\n${text}`

    return await this.generateCompletion(userPrompt, systemPrompt, {
      temperature: 0.2
    })
  }

  /**
   * Generate code explanation
   */
  async explainCode(code: string, language?: string): Promise<string> {
    const systemPrompt = `你是一个专业的代码解释器。请详细解释给定的代码，包括其功能、逻辑和关键部分的作用。使用通俗易懂的语言，适合初学者理解。`

    const userPrompt = language
      ? `请解释以下${language}代码：\n\n${code}`
      : `请解释以下代码：\n\n${code}`

    return await this.generateCompletion(userPrompt, systemPrompt, {
      temperature: 0.3
    })
  }

  /**
   * Generate article title suggestions
   */
  async generateTitleSuggestions(content: string, count = 5): Promise<string[]> {
    const systemPrompt = `你是一个专业的标题生成器。请根据文章内容生成${count}个吸引人的标题建议。标题应该简洁有力，能够准确概括文章内容并吸引读者点击。`

    const userPrompt = `请为以下文章内容生成标题建议：\n\n${content}`

    const response = await this.generateCompletion(userPrompt, systemPrompt, {
      max_tokens: 300,
      temperature: 0.7
    })

    return response
      .split('\n')
      .map((title) => title.replace(/^\d+\.\s*/, '').trim())
      .filter(Boolean)
      .slice(0, count)
  }

  /**
   * Check if service is configured
   */
  isConfigured(): boolean {
    return !!process.env['DEEPSEEK_API_KEY'] || !!process.env['OPENAI_API_KEY']
  }

  /**
   * Get current model info
   */
  getModelInfo(): { model: string; baseURL?: string; configured: boolean } {
    return {
      model: this.model,
      baseURL: process.env['DEEPSEEK_BASE_URL'] || 'https://api.deepseek.com/v1',
      configured: this.isConfigured()
    }
  }

  /**
   * Test connection to API
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.generateCompletion('Hello', undefined, {
        max_tokens: 10
      })
      return !!response
    } catch (error) {
      console.error('OpenAI API connection test failed:', error)
      return false
    }
  }
}

// Export singleton instance
export const openaiService = new OpenAIService()
