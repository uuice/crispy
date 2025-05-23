'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            关于 Crispy
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            一个现代化的多人在线知识管理平台
          </p>
        </motion.div>

        {/* 项目介绍 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
        >
          <h2 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">项目简介</h2>
          <div className="prose dark:prose-invert max-w-none text-lg">
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              Crispy 是一个专注于信息管理的现代化平台。它集成了书签管理、博客写作、
              知识库、团队任务管理等多种功能，旨在提供一个高效、便捷的在线知识管理环境。
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              无论是个人知识管理，还是团队知识管理，Crispy 都能为您提供最佳解决方案。
            </p>
          </div>
        </motion.section>

        {/* 核心特点 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-semibold mb-8 text-center text-gray-900 dark:text-white">
            核心特点
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: '📚',
                title: '智能书签管理',
                description: '自动分类、标签管理、快速搜索，让您的收藏更有条理',
              },
              {
                icon: '✍️',
                title: '博客写作平台',
                description: '支持 Markdown、实时预览、版本控制，让写作更轻松',
              },
              {
                icon: '👥',
                title: '团队协作',
                description: '实时协作、任务管理、进度追踪，提升团队效率',
              },
              {
                icon: '🔄',
                title: '数据同步',
                description: '多设备实时同步，随时随地访问您的数据',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 * index }}
                whileHover={{ scale: 1.02 }}
                className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 技术栈 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-16 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
        >
          <h2 className="text-3xl font-semibold mb-8 text-center text-gray-900 dark:text-white">
            技术栈
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              'Next.js 15',
              'Node.js',
              'React',
              'TypeScript',
              'Tailwind CSS',
              'Prisma',
              'PostgreSQL',
            ].map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300"
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 开始使用 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-white">开始使用</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            立即加入 Crispy，开启您的协作之旅
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/"
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              返回首页
            </Link>
          </motion.div>
        </motion.section>
      </div>
    </div>
  )
}
