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
  const [darkMode, setDarkMode] = React.useState(false)

  React.useEffect(() => {
    // 检查系统偏好或本地存储
    const isDark = localStorage.getItem('darkMode') === 'true' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    if (newMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
  }

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--deep-text)] transition-colors duration-300">
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
                <a href="/archives" className={`link ${pageType === 'Archive' ? 'text-[var(--primary)]' : ''}`}>
                  归档
                </a>
                <a href="/daily-libs" className={`link ${pageType === 'DailyLib' ? 'text-[var(--primary)]' : ''}`}>
                  每日库
                </a>
                <a href="/links" className={`link ${pageType === 'Link' ? 'text-[var(--primary)]' : ''}`}>
                  友链
                </a>
                <a href="/about" className={`link ${pageType === 'Page' ? 'text-[var(--primary)]' : ''}`}>
                  关于
                </a>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="btn-regular p-2 rounded-full"
                aria-label="切换暗黑模式"
              >
                {darkMode ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 主内容区域 */}
          <div className="lg:flex-1">
            {children}
          </div>

          {/* 侧边栏 */}
          <aside className="lg:w-80 space-y-6">
            {/* 作者信息卡片 */}
            <div className="card-base p-6">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-[var(--primary)] mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {siteConfig?.author?.charAt(0) || '我'}
                </div>
                <h3 className="text-xl font-bold mb-2">{siteConfig?.author || '博主'}</h3>
                <p className="text-sm text-[var(--btn-content)] mb-4">
                  {siteConfig?.description || '一个热爱技术的开发者'}
                </p>
                <div className="flex justify-center space-x-4">
                  {siteConfig?.github && (
                    <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="text-[var(--btn-content)] hover:text-[var(--primary)] transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                      </svg>
                    </a>
                  )}
                  {siteConfig?.twitter && (
                    <a href={siteConfig.twitter} target="_blank" rel="noopener noreferrer" className="text-[var(--btn-content)] hover:text-[var(--primary)] transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.29 18.251c7.29 0 11.39-6.021 11.39-11.39 0-.179 0-.357-.012-.531A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* 统计信息卡片 */}
            <div className="card-base p-6">
              <h3 className="text-lg font-semibold mb-4">统计信息</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--primary)]">0</div>
                  <div className="text-sm text-[var(--btn-content)]">文章数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--primary)]">{categories.length}</div>
                  <div className="text-sm text-[var(--btn-content)]">分类数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--primary)]">{tags.length}</div>
                  <div className="text-sm text-[var(--btn-content)]">标签数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--primary)]">{currentYear}</div>
                  <div className="text-sm text-[var(--btn-content)]">建站年份</div>
                </div>
              </div>
            </div>

            {/* 分类卡片 */}
            {categories.length > 0 && (
              <div className="card-base p-6">
                <h3 className="text-lg font-semibold mb-4">分类</h3>
                <div className="space-y-2">
                  {categories.map((category: any) => (
                    <a
                      key={category.id}
                      href={`/categories/${category.alias}`}
                      className="flex justify-between items-center p-2 rounded-lg hover:bg-[var(--btn-plain-bg-hover)] transition-colors"
                    >
                      <span className="text-[var(--btn-content)]">{category.name}</span>
                      <span className="text-xs bg-[var(--btn-regular-bg)] text-[var(--btn-content)] px-2 py-1 rounded-full">
                        {category.article_count || 0}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* 标签云卡片 */}
            {tags.length > 0 && (
              <div className="card-base p-6">
                <h3 className="text-lg font-semibold mb-4">标签云</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag: any) => (
                    <a
                      key={tag.id}
                      href={`/tags/${tag.value}`}
                      className="text-sm px-3 py-1 rounded-full bg-[var(--btn-regular-bg)] text-[var(--btn-content)] hover:bg-[var(--primary)] hover:text-white transition-colors"
                    >
                      {tag.title}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* 最新文章卡片 */}
            <div className="card-base p-6">
              <h3 className="text-lg font-semibold mb-4">最新文章</h3>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <a
                    key={i}
                    href="#"
                    className="block group"
                  >
                    <div className="text-sm text-[var(--btn-content)] group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                      这里是第{i}篇示例文章的标题，展示最新文章的样式
                    </div>
                    <div className="text-xs text-[var(--btn-content)]/60 mt-1">
                      2024-01-0{i}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

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
  )
}
