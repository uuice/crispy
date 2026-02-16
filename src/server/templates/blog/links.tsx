import React from 'react'
import BlogLayout from './layout'

interface LinksPageProps {
  siteConfig?: any
  categories?: any[]
  tags?: any[]
  currentYear?: number
  baseUrl?: string
  linkCategories?: any[]
  groupedLinks?: { [key: string]: any[] }
  links?: any[]
}

export default function LinksPage({
  siteConfig,
  categories,
  tags,
  currentYear,
  baseUrl,
  linkCategories = [],
  groupedLinks = {},
  links = []
}: LinksPageProps) {
  return (
    <BlogLayout
      siteConfig={siteConfig}
      categories={categories}
      tags={tags}
      currentYear={currentYear}
      baseUrl={baseUrl}
      pageType="Link"
    >
      <div className="max-w-6xl mx-auto">
        {/* 友链头部 */}
        <div className="relative overflow-hidden rounded-3xl mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-teal-600 to-blue-500"></div>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative p-12 text-white">
            <div className="max-w-4xl">
              <div className="flex items-center mb-6">
                <div className="w-4 h-4 bg-white rounded-full mr-3 animate-pulse"></div>
                <span className="text-lg font-medium bg-white/20 px-4 py-2 rounded-full">
                  🔗 友情链接
                </span>
              </div>
              <h1 className="text-5xl font-bold mb-6">友情链接</h1>
              <p className="text-xl opacity-90 mb-8 max-w-2xl">
                感谢这些优秀的网站和博主，让我们一起构建更美好的网络社区。
              </p>
              <div className="flex items-center gap-6">
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">互惠互利</span>
                </div>
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  <span className="font-medium">社区共建</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {Object.keys(groupedLinks).length > 0 ? (
          <div className="space-y-12">
            {Object.entries(groupedLinks).map(([categoryName, categoryLinks]) => (
              <div key={categoryName} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">{categoryName}</h2>
                    <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium">
                      {categoryLinks.length} 个链接
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryLinks.map((link: any, index: number) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200"
                      >
                        <div className="relative h-32 bg-gradient-to-br from-green-400 to-teal-400 flex items-center justify-center">
                          {link.avatar ? (
                            <img
                              src={link.avatar}
                              alt={link.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                                target.parentElement!.querySelector('.fallback-avatar')!.classList.remove('hidden')
                              }}
                            />
                          ) : (
                            <div className="text-white text-center fallback-avatar">
                              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                <span className="text-lg font-bold">{link.name?.charAt(0) || '友'}</span>
                              </div>
                              <p className="text-sm font-medium">{link.name}</p>
                            </div>
                          )}
                          <div className="absolute top-3 right-3">
                            <span className="bg-white/90 backdrop-blur-sm text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                              #{index + 1}
                            </span>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        
                        <div className="p-4">
                          <h3 className="font-bold text-lg mb-2 group-hover:text-green-600 transition-colors">
                            {link.name}
                          </h3>
                          {link.description && (
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                              {link.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-xs text-gray-500 truncate">
                              <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                              </svg>
                              <span className="truncate">{link.url.replace('https://', '').replace('http://', '')}</span>
                            </div>
                            <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/30">
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">暂无友情链接</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              还没有添加任何友情链接，欢迎优秀的网站和博主加入我们的友链大家庭！
            </p>
            <a
              href="mailto:admin@example.com"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              申请友链
            </a>
          </div>
        )}

        {/* 申请友链 */}
        <div className="card-base p-6 mt-8">
          <h3 className="text-xl font-semibold mb-4">申请友链</h3>
          <div className="prose prose-sm max-w-none text-[var(--btn-content)]">
            <p>如果您希望与本站交换友情链接，请满足以下要求：</p>
            <ul className="mt-2 space-y-1">
              <li>网站内容健康、积极向上</li>
              <li>有一定的原创内容</li>
              <li>网站正常访问，无恶意代码</li>
              <li>已在您的网站添加本站链接</li>
            </ul>
            <p className="mt-4">
              请通过邮件联系：<a href="mailto:admin@example.com" className="text-[var(--primary)] hover:underline">
                admin@example.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </BlogLayout>
  )
}
