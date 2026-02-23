import React from 'react'
import BlogLayout from './layout'

interface AboutPageProps {
  siteConfig?: any
  categories?: any[]
  tags?: any[]
  currentYear?: number
  baseUrl?: string
  page?: any
}

export default function AboutPage({
  siteConfig,
  categories,
  tags,
  currentYear,
  baseUrl,
  page
}: AboutPageProps) {
  return (
    <BlogLayout
      siteConfig={siteConfig}
      categories={categories}
      tags={tags}
      currentYear={currentYear}
      baseUrl={baseUrl}
      pageType="Page"
    >
      <div className="max-w-6xl mx-auto">
        {/* 关于横幅 */}
        <div className="relative overflow-hidden rounded-3xl mb-16">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-teal-600 to-blue-600"></div>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative p-16 text-white">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-8">
                <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center p-4">
                  <div className="w-full h-full rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-4xl font-bold text-white shadow-xl">
                    {siteConfig?.author?.charAt(0) || '前'}
                  </div>
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-6">
                {siteConfig?.author || '前端资源分享'}
              </h1>
              <p className="text-xl text-green-100 mb-10 max-w-3xl mx-auto leading-relaxed">
                {siteConfig?.description || '分享实用的前端工具和框架，帮助开发者解决实际问题'}
              </p>
              <div className="flex items-center justify-center gap-8">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                  <span>🚀</span>
                  <span className="font-medium">技术分享</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                  <span>🌟</span>
                  <span className="font-medium">品质保证</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 简介 */}
        <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl p-10 shadow-lg border border-gray-200 mb-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 flex items-center justify-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">💡</span>
              </div>
              关于本站
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="prose prose-lg max-w-none text-gray-700">
                <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 我们的使命</h3>
                <p className="text-lg leading-relaxed">
                  这里收集和分享实用的前端工具和框架。我们选择那些在实际项目中真正有用的资源，帮助开发者提高工作效率。
                </p>
                <p className="text-lg leading-relaxed mt-4">
                  希望能帮助大家找到解决开发问题的好工具，少走弯路，多写代码。
                </p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-green-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>✨</span>
                  核心价值
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">1</span>
                    <span className="text-gray-700">精选优质资源，拒绝垃圾信息</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">2</span>
                    <span className="text-gray-700">详细的技术介绍和使用指南</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">3</span>
                    <span className="text-gray-700">持续更新，紧跟技术发展趋势</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 联系方式 */}
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-10 shadow-lg border border-gray-200">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10 text-gray-800 flex items-center justify-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">🤝</span>
              </div>
              交流合作
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-blue-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>📬</span>
                  联系我们
                </h3>
                <p className="text-gray-600 mb-6">
                  欢迎通过以下方式与我们联系，分享您的想法和建议。
                </p>
                <div className="space-y-4">
                  {siteConfig?.github && (
                    <a
                      href={siteConfig.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl hover:from-gray-900 hover:to-black transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-bold">GitHub</div>
                        <div className="text-sm opacity-80">查看项目源码和贡献</div>
                      </div>
                    </a>
                  )}

                  {siteConfig?.email && (
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-bold">Email</div>
                        <div className="text-sm opacity-80">发送邮件交流</div>
                      </div>
                    </a>
                  )}
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-blue-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>💡</span>
                  合作建议
                </h3>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">1</span>
                    <span>推荐优质的前端库和工具</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">2</span>
                    <span>提供技术文章和教程投稿</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">3</span>
                    <span>反馈网站改进建议</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">4</span>
                    <span>技术交流和经验分享</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">一起构建更好的前端生态</h3>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                我们相信开源的力量，期待与更多开发者一起分享知识、交流经验，共同推动前端技术的发展。
              </p>
              <div className="flex items-center justify-center gap-2 mt-4 text-blue-600">
                <span>🌟</span>
                <span className="font-medium">感谢您的支持与参与</span>
                <span>🌟</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BlogLayout>
  )
}

