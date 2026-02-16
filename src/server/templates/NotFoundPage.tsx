import React from 'react';
import { BaseLayout } from '../components/BaseLayout';

interface NotFoundPageProps {
  timestamp?: string;
  siteConfig?: any;
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({ timestamp, siteConfig }) => {
  return (
    <>
      <BaseLayout
        title="404 - 页面未找到"
        description="您访问的页面不存在或已被移动"
      >
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
              <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="text-5xl font-bold mb-6 gradient-text">
                  404
                </h1>
                <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                  抱歉，您访问的页面不存在或已被移动<br />
                  让我们一起回到正确的道路上
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/"
                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    返回首页
                  </a>
                  <a
                    href="/archives"
                    className="inline-flex items-center justify-center px-6 py-3 bg-white/80 hover:bg-white text-gray-700 font-medium rounded-lg transition-all duration-300 border border-gray-200 hover:border-purple-300 hover:shadow-lg"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    浏览文章
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/30">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">可能的原因</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  页面地址输入错误
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mr-2"></div>
                  页面已被删除或移动
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  链接已过期
                </div>
              </div>
            </div>

            <div className="mt-8 text-sm text-gray-500">
              <p>✨ Crispy - 现代化的博客平台</p>
              {timestamp && (
                <p className="mt-2">错误时间: {new Date(timestamp).toLocaleString('zh-CN')}</p>
              )}
            </div>
          </div>
        </div>
      </BaseLayout>
    </>
  );
};

export default NotFoundPage;
