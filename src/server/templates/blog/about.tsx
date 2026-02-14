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
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">关于</h1>
          <p className="text-[var(--btn-content)]">
            了解更多关于这个博客的信息
          </p>
        </div>

        <div className="card-base p-8">
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <div className="text-center mb-8">
              <div className="w-24 h-24 rounded-full bg-[var(--primary)] mx-auto mb-6 flex items-center justify-center text-white text-3xl font-bold">
                {siteConfig?.author?.charAt(0) || '我'}
              </div>
              <h2 className="text-2xl font-bold mb-2">{siteConfig?.author || '博主'}</h2>
              <p className="text-[var(--btn-content)]">
                {siteConfig?.description || '一个热爱技术的开发者'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-[var(--btn-plain-bg-hover)] rounded-lg">
                <div className="w-12 h-12 bg-[var(--primary)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">技术分享</h3>
                <p className="text-sm text-[var(--btn-content)]">
                  分享编程经验和技术心得
                </p>
              </div>

              <div className="text-center p-6 bg-[var(--btn-plain-bg-hover)] rounded-lg">
                <div className="w-12 h-12 bg-[var(--primary)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">学习记录</h3>
                <p className="text-sm text-[var(--btn-content)]">
                  记录学习过程和成长轨迹
                </p>
              </div>

              <div className="text-center p-6 bg-[var(--btn-plain-bg-hover)] rounded-lg">
                <div className="w-12 h-12 bg-[var(--primary)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">交流互动</h3>
                <p className="text-sm text-[var(--btn-content)]">
                  与读者朋友们交流分享
                </p>
              </div>
            </div>

            <div className="border-t border-[var(--line-divider)] pt-8">
              <h3 className="text-xl font-semibold mb-4">博客信息</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">技术栈</h4>
                  <ul className="text-sm text-[var(--btn-content)] space-y-1">
                    <li>• React + TypeScript</li>
                    <li>• Node.js + Express</li>
                    <li>• PostgreSQL 数据库</li>
                    <li>• Tailwind CSS</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">功能特性</h4>
                  <ul className="text-sm text-[var(--btn-content)] space-y-1">
                    <li>• 响应式设计</li>
                    <li>• 暗黑模式支持</li>
                    <li>• 文章搜索功能</li>
                    <li>• 友情链接管理</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border-t border-[var(--line-divider)] pt-8 mt-8">
              <h3 className="text-xl font-semibold mb-4">联系方式</h3>
              <div className="flex flex-wrap gap-4">
                {siteConfig?.github && (
                  <a
                    href={siteConfig.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--btn-regular-bg)] rounded-lg hover:bg-[var(--primary)] hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                    </svg>
                    GitHub
                  </a>
                )}
                {siteConfig?.twitter && (
                  <a
                    href={siteConfig.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--btn-regular-bg)] rounded-lg hover:bg-[var(--primary)] hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.29 18.251c7.29 0 11.39-6.021 11.39-11.39 0-.179 0-.357-.012-.531A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                    Twitter
                  </a>
                )}
                {siteConfig?.email && (
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--btn-regular-bg)] rounded-lg hover:bg-[var(--primary)] hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BlogLayout>
  )
}
