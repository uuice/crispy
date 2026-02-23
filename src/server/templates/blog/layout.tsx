import React from 'react'

interface BlogLayoutProps {
  children: React.ReactNode
  siteConfig?: any
  categories?: any[]
  tags?: any[]
  currentYear?: number
  baseUrl?: string
  pageType?: string
}

export default function BlogLayout({
  children,
  siteConfig = {},
  categories = [],
  tags = [],
  currentYear = new Date().getFullYear(),
  baseUrl = '',
  pageType = ''
}: BlogLayoutProps) {
  return (
    <html lang="en" className="bg-[var(--page-bg)] transition text-[14px] md:text-[16px]">
    <style>
      {`
        :root {
          --page-bg: #ffffff;
          --deep-text: #333333;
          --btn-content: #666666;
          --primary: #3b82f6;
          --line-divider: #e5e7eb;
          --card-bg: #ffffff;
          --btn-regular-bg: #f3f4f6;
          --btn-plain-bg-hover: #f9fafb;
        }

        .dark {
          --page-bg: #1f2937;
          --deep-text: #f9fafb;
          --btn-content: #d1d5db;
          --primary: #60a5fa;
          --line-divider: #374151;
          --card-bg: #111827;
          --btn-regular-bg: #374151;
          --btn-plain-bg-hover: #4b5563;
        }

        /* 浮层面板隐藏样式 - 覆盖 main.css 中的定义 */
        .float-panel-closed {
          display: none !important;
          transform: translateY(-0.25rem) !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
      `}
    </style>
    <head>
      <title>我的博客</title>
      <meta charSet="UTF-8" />
      <meta name="description" content="默认描述" />
      <meta name="author" content="默认作者" />
      <meta property="og:site_name" content="我的博客" />
      <meta property="og:url" content="" />
      <meta property="og:title" content="我的博客" />
      <meta property="og:description" content="默认描述" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="" />
      <meta name="twitter:title" content="我的博客" />
      <meta name="twitter:description" content="默认描述" />
      <meta name="viewport" content="width=device-width" />
      <link
        rel="icon"
        href="/assets/favicon/favicon-light-32.png"
        sizes="32x32"
        media="(prefers-color-scheme: light)"
      />
      <link
        rel="icon"
        href="/assets/favicon/favicon-light-128.png"
        sizes="128x128"
        media="(prefers-color-scheme: light)"
      />
      <link
        rel="icon"
        href="/assets/favicon/favicon-light-180.png"
        sizes="180x180"
        media="(prefers-color-scheme: light)"
      />
      <link
        rel="icon"
        href="/assets/favicon/favicon-light-192.png"
        sizes="192x192"
        media="(prefers-color-scheme: light)"
      />
      <link
        rel="icon"
        href="/assets/favicon/favicon-dark-32.png"
        sizes="32x32"
        media="(prefers-color-scheme: dark)"
      />
      <link
        rel="icon"
        href="/assets/favicon/favicon-dark-128.png"
        sizes="128x128"
        media="(prefers-color-scheme: dark)"
      />
      <link
        rel="icon"
        href="/assets/favicon/favicon-dark-180.png"
        sizes="180x180"
        media="(prefers-color-scheme: dark)"
      />
      <link
        rel="icon"
        href="/assets/favicon/favicon-dark-192.png"
        sizes="192x192"
        media="(prefers-color-scheme: dark)"
      />
      <script src="/assets/javascript/jquery-3.7.1.min.js"></script>

      {/* pjax 支持 */}
      <script src="/assets/javascript/jquery.pjax.js"></script>

      <script src="/assets/javascript/main.js"></script>



      {/* Tailwind CSS */}
      <script src="https://cdn.tailwindcss.com"></script>
      <link
        rel="alternate"
        type="application/rss+xml"
        title={siteConfig?.siteName || '我的博客'}
        href={`${siteConfig?.baseUrl || ''}/rss.xml`}
      />
      {/* <link rel="stylesheet" href="/assets/styles/style.css" /> */}
    </head>
      <body className="min-h-screen transition lg:is-home enable-banner">
      <div className="min-h-screen bg-[var(--page-bg)] text-[var(--deep-text)] transition-colors duration-300">
           {/* 移除重复的暗黑模式脚本，使用 main.js 中的实现 */}
          {/* 粒子效果画布 */}
          <canvas
            id="particle-canvas"
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1]"
          ></canvas>

          {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--page-bg)]/80 backdrop-blur-md border-b border-[var(--line-divider)]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <a href="/" className="text-2xl font-bold text-[var(--primary)] hover:opacity-80 transition-opacity">
                {siteConfig?.siteName || '我的博客'}
              </a>

              <nav className="hidden md:flex space-x-6">
                <a href="/" className={`link ${pageType === 'Index' ? 'text-[var(--primary)]' : ''}`}>
                  首页
                </a>
                <a href="/daily-libs" className={`link ${pageType === 'DailyLib' ? 'text-[var(--primary)]' : ''}`}>
                  前端库
                </a>
                <a href="/navigation" className={`link ${pageType === 'Navigation' ? 'text-[var(--primary)]' : ''}`}>
                  导航
                </a>
                <a href="/about" className={`link ${pageType === 'Page' ? 'text-[var(--primary)]' : ''}`}>
                  关于
                </a>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              {/* 搜索按钮 */}
              <button
                id="search-switch"
                className="btn-regular p-2 rounded-full"
                aria-label="搜索"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>

              {/* 暗黑模式切换按钮 */}
              <button
                id="scheme-switch"
                className="btn-regular p-2 rounded-full"
                aria-label="切换暗黑模式"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              </button>

              {/* 移动端菜单按钮 */}
              <button
                id="nav-menu-switch"
                className="btn-regular p-2 rounded-full md:hidden"
                aria-label="菜单"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 搜索面板 - 默认隐藏 */}
      <div id="search-panel" className="fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm z-50 float-panel-closed transition-all duration-300">
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl bg-[var(--page-bg)] rounded-lg shadow-xl p-6">
          <div className="relative">
            <input
              id="search-input"
              type="text"
              placeholder="搜索文章..."
              className="w-full px-4 py-3 rounded-lg border border-[var(--line-divider)] bg-[var(--card-bg)] text-[var(--deep-text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              autoFocus
            />
            <div id="search-results" className="mt-4 max-h-96 overflow-y-auto">
              {/* 搜索结果将在这里显示 */}
            </div>
          </div>
        </div>
      </div>

      {/* 移动端菜单面板 */}
      <div id="nav-menu-panel" className="fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm z-50 float-panel-closed transition-all duration-300 md:hidden">
        <div className="absolute top-0 right-0 w-64 h-full bg-[var(--page-bg)] shadow-xl p-6">
          <nav className="space-y-4">
            <a href="/" className={`block py-2 ${pageType === 'Index' ? 'text-[var(--primary)]' : 'text-[var(--deep-text)]'}`}>首页</a>
            <a href="/daily-libs" className={`block py-2 ${pageType === 'DailyLib' ? 'text-[var(--primary)]' : 'text-[var(--deep-text)]'}`}>前端库</a>
            <a href="/navigation" className={`block py-2 ${pageType === 'Navigation' ? 'text-[var(--primary)]' : 'text-[var(--deep-text)]'}`}>导航</a>
            <a href="/about" className={`block py-2 ${pageType === 'Page' ? 'text-[var(--primary)]' : 'text-[var(--deep-text)]'}`}>关于</a>
          </nav>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div id="pjax-container">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 主内容区域 */}
          <div className="lg:flex-1">
            {children}
          </div>

          {/* 侧边栏 */}
          <aside className="lg:w-80 space-y-6">
            {/* 作者信息卡片 */}
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 mx-auto flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                    {siteConfig?.author?.charAt(0) || '前'}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gray-800">{siteConfig?.author || '前端资源分享'}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {siteConfig?.description || '分享实用的前端工具，帮助大家提高开发效率'}
                </p>
                <div className="flex justify-center space-x-4 mb-4">
                  {siteConfig?.github && (
                    <a
                      href={siteConfig.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-800 text-white rounded-xl flex items-center justify-center hover:bg-gray-900 transition-colors shadow-md hover:shadow-lg"
                      title="GitHub"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                      </svg>
                    </a>
                  )}
                  {siteConfig?.email && (
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl flex items-center justify-center hover:from-blue-600 hover:to-indigo-600 transition-colors shadow-md hover:shadow-lg"
                      title="Email"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </a>
                  )}
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <span>🌟</span>
                    <span>优质资源</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span>⚡</span>
                    <span>持续更新</span>
                  </span>
                </div>
              </div>
            </div>

            {/* 统计信息卡片 */}
            <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">📊</span>
                </div>
                网站统计
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-green-200 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-white text-xl">📁</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
                  <div className="text-sm text-gray-600">分类数</div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-green-200 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-white text-xl">🏷️</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">{tags.length}</div>
                  <div className="text-sm text-gray-600">标签数</div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-green-200 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-white text-xl">📅</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">{currentYear}</div>
                  <div className="text-sm text-gray-600">建站年份</div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-green-200 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-white text-xl">📚</span>
                  </div>
                  <div className="text-2xl font-bold text-red-600">0</div>
                  <div className="text-sm text-gray-600">库数量</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-green-200">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <span>🔄</span>
                    <span>实时更新</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span>📈</span>
                    <span>数据统计</span>
                  </span>
                </div>
              </div>
            </div>

            {/* 快速导航卡片 */}
            <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">🚀</span>
                </div>
                快速导航
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="/daily-libs"
                  className="group flex flex-col items-center gap-2 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-indigo-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white text-xl">
                    📚
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 text-center">前端库</span>
                </a>
                <a
                  href="/navigation"
                  className="group flex flex-col items-center gap-2 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-indigo-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-xl">
                    🔗
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 text-center">导航</span>
                </a>
                <a
                  href="/categories"
                  className="group flex flex-col items-center gap-2 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-indigo-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center text-white text-xl">
                    📁
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 text-center">分类</span>
                </a>
                <a
                  href="/tags"
                  className="group flex flex-col items-center gap-2 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-indigo-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-white text-xl">
                    🏷️
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 text-center">标签</span>
                </a>
              </div>
              <div className="mt-4 pt-4 border-t border-indigo-200">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <span>⚡</span>
                    <span>一键直达</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span>🧭</span>
                    <span>便捷导航</span>
                  </span>
                </div>
              </div>
            </div>

            {/* 分类卡片 */}
            {categories.length > 0 && (
              <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">📁</span>
                  </div>
                  分类导航
                </h3>
                <div className="space-y-3">
                  {categories.map((category: any, index: number) => (
                    <a
                      key={category.id}
                      href={`/categories/${category.alias}`}
                      className="group block bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-purple-200 hover:border-purple-300 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center text-purple-600 font-bold">
                            {index + 1}
                          </div>
                          <span className="text-gray-700 group-hover:text-purple-600 font-medium">{category.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                            {category.article_count || 0} 个
                          </span>
                          <svg className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-purple-200 text-center">
                  <a
                    href="/categories"
                    className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 font-medium"
                  >
                    <span>查看所有分类</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>
            )}

            {/* 标签云卡片 */}
            {tags.length > 0 && (
              <div className="bg-gradient-to-br from-white to-yellow-50 rounded-2xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">🏷️</span>
                  </div>
                  热门标签
                </h3>
                <div className="flex flex-wrap gap-3">
                  {tags.map((tag: any, index: number) => (
                    <a
                      key={tag.id}
                      href={`/tags/${tag.value}`}
                      className="group relative inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 rounded-xl hover:from-yellow-200 hover:to-orange-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md border border-yellow-200"
                    >
                      <span className="text-lg">#{index + 1}</span>
                      <span className="font-medium">{tag.title}</span>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>🔥</span>
                      </div>
                    </a>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-yellow-200">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <span>📊</span>
                      <span>共 {tags.length} 个标签</span>
                    </span>
                    <a
                      href="/tags"
                      className="text-yellow-600 hover:text-yellow-800 font-medium flex items-center gap-1"
                    >
                      <span>全部标签</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* 热门推荐卡片 */}
            <div className="bg-gradient-to-br from-white to-red-50 rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">🔥</span>
                </div>
                热门推荐
              </h3>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <a
                    key={i}
                    href="#"
                    className="group block bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-red-200 hover:border-red-300 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                        {i}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 group-hover:text-red-600 mb-1">
                          第{i}个热门前端库
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          实用的前端开发工具，接口简单，功能实用，能有效提升开发效率。
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <span>⭐</span>
                              <span>4.8</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <span>📥</span>
                              <span>10K+</span>
                            </span>
                          </div>
                          <span className="text-xs text-red-600 font-medium">NEW</span>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-red-200 text-center">
                <a
                  href="/daily-libs"
                  className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  <span>查看所有推荐</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </main>
      </div>

      {/* Footer */}
      <footer className="bg-[var(--card-bg)] border-t border-[var(--line-divider)] py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[var(--btn-content)]">
            © {currentYear} {siteConfig?.author || '博主'}. All rights reserved.
          </p>
          <p className="text-sm text-[var(--btn-content)]/60 mt-2">
            Powered by Crispy Blog
          </p>
        </div>
      </footer>
    </div>
    </body>
  </html>

  )
}
