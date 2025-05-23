'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { User } from '@/types/user'
import { motion } from 'framer-motion'

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 加载用户列表
  const loadUsers = async (query?: string) => {
    try {
      setLoading(true)
      const url = query ? `/api/users?q=${encodeURIComponent(query)}` : '/api/users'
      const response = await fetch(url)
      if (!response.ok) throw new Error('加载用户失败')
      const data = await response.json()
      setUsers(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载用户失败')
    } finally {
      setLoading(false)
    }
  }

  // 初始加载
  useEffect(() => {
    loadUsers()
  }, [])

  // 搜索处理
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadUsers(searchQuery)
  }

  // 删除用户
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个用户吗？')) return

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('删除用户失败')
      setUsers(users.filter(user => user.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除用户失败')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          用户管理
        </h1>
        <Link
          href="/users/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          添加用户
        </Link>
      </div>

      {/* 搜索表单 */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="搜索用户..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-200"
          >
            搜索
          </button>
        </div>
      </form>

      {/* 错误提示 */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      )}

      {/* 加载状态 */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : (
        /* 用户列表 */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {user.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <p>创建时间：{new Date(user.createdAt).toLocaleString()}</p>
                  <p>更新时间：{new Date(user.updatedAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/user-center/users/${user.id}`}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    编辑
                  </Link>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    删除
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 空状态 */}
      {!loading && users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">暂无用户数据</p>
        </div>
      )}
    </div>
  )
}
