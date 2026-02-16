import React from 'react';
import { BaseLayout } from '../components/BaseLayout';

interface ErrorPageProps {
  statusCode?: number;
  title?: string;
  message?: string;
  siteConfig?: any;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  statusCode = 500,
  title = '错误',
  message = '页面出现错误',
  siteConfig
}) => {
  const getErrorIcon = () => {
    switch (statusCode) {
      case 404:
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        );
      case 403:
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        );
      case 500:
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        );
      default:
        return (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
    }
  };

  return (
    <BaseLayout
      title={`${title || '错误'} - ${siteConfig?.siteName || 'Crispy'}`}
      description={message || '页面出现错误'}
    >
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center">
            {/* 错误卡片 */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-orange-500 to-yellow-500 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
              <div className="relative bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/30">
                {/* 错误图标 */}
                <div className="mx-auto h-24 w-24 text-gray-600 mb-6">
                  {getErrorIcon()}
                </div>

                {/* 错误码 */}
                <h1 className="text-7xl font-bold mb-4 gradient-text">{statusCode || '错误'}</h1>

                {/* 错误标题 */}
                <h2 className="text-3xl font-semibold text-gray-800 mb-6">{title || '出现错误'}</h2>

                {/* 错误消息 */}
                <p className="text-gray-600 mb-8 text-lg max-w-lg mx-auto">
                  {message || '页面出现了一些问题，请稍后重试。我们的技术团队已经在处理这个问题了。'}
                </p>

                {/* 操作按钮 */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <button
                    onClick={() => window.history.back()}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    返回上页
                  </button>

                  <a
                    href="/"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                    回到首页
                  </a>
                </div>

                {statusCode === 404 && (
                  <div className="mt-6">
                    <a href="/archives" className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors font-medium">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                      或者浏览我们的博客文章
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* 额外信息卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {statusCode === 404 ? (
                <div className="bg-blue-50/80 backdrop-blur-sm rounded-xl p-6 border border-blue-100">
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <h3 className="text-lg font-semibold text-blue-800">可能的原因</h3>
                  </div>
                  <ul className="text-blue-700 space-y-2">
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                      页面地址输入错误
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                      页面已被删除或移动
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                      链接已过期
                    </li>
                  </ul>
                </div>
              ) : statusCode === 500 ? (
                <div className="bg-red-50/80 backdrop-blur-sm rounded-xl p-6 border border-red-100">
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <h3 className="text-lg font-semibold text-red-800">解决方案</h3>
                  </div>
                  <ul className="text-red-700 space-y-2">
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2"></div>
                      请稍后重试
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2"></div>
                      清除浏览器缓存
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2"></div>
                      联系网站管理员
                    </li>
                  </ul>
                </div>
              ) : null}

              {/* 帮助信息 */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  <h3 className="text-lg font-semibold text-gray-800">需要帮助？</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  如果问题持续存在，请通过以下方式联系我们：
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    support@crispy.blog
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    在线客服
                  </div>
                </div>
              </div>
            </div>

            {/* 搜索框 */}
            {statusCode === 404 && (
              <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">或者搜索您需要的内容</h3>
                <form action="/blog/search" method="get" className="max-w-md mx-auto">
                  <div className="flex">
                    <input
                      type="text"
                      name="q"
                      placeholder="搜索文章、标签或分类..."
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-white/80"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-r-lg transition-all duration-300 font-medium"
                    >
                      搜索
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 脚本部分 */}
      <script
        dangerouslySetInnerHTML={{
          __html: statusCode === 500 ? `
            let retryCount = 0;
            const maxRetries = 3;

            function autoRetry() {
              if (retryCount < maxRetries) {
                retryCount++;
                setTimeout(() => {
                  console.log(\`自动重试第 \${retryCount} 次...\`);
                  window.location.reload();
                }, 5000 * retryCount); // 递增延迟
              }
            }

            // 5秒后开始第一次重试
            setTimeout(autoRetry, 5000);
          ` : ''
        }}
      />

      <script
        dangerouslySetInnerHTML={{
          __html: `
            function reportError() {
              if (navigator.sendBeacon) {
                const errorData = {
                  statusCode: ${statusCode || 0},
                  message: '${message || ''}',
                  url: window.location.href,
                  userAgent: navigator.userAgent,
                  timestamp: new Date().toISOString()
                };

                navigator.sendBeacon('/api/error-report', JSON.stringify(errorData));
              }
            }

            // 页面加载完成后报告错误
            document.addEventListener('DOMContentLoaded', reportError);
          `
        }}
      />
    </BaseLayout>
  );
};

export default ErrorPage;
