'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, UpdateUserInput } from '@/types/user'
import { motion } from 'framer-motion'

export default function EditUserPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<UpdateUserInput>({
    name: '',
    email: '',
    avatar: '',
  })

  // 加载用户数据
  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch(`/api/users/${params.id}`)
        if (!response.ok) throw new Error('加载用户失败')
        const data = await response.json()
        setUser(data)
        setFormData({
          name: data.name,
          email: data.email,
          avatar: data.avatar,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载用户失败')
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [params.id])

  // 表单提交处理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/users/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('更新用户失败')
      router.push('/user-center/users')
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新用户失败')
    }
  }

  // 表单字段变更处理
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-4 bg-red-100 text-red-700 rounded-lg dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-4 bg-yellow-100 text-yellow-700 rounded-lg dark:bg-yellow-900 dark:text-yellow-200">
          用户不存在
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
          编辑用户
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              姓名
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              邮箱
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
            />
          </div>

          <div>
            <label
              htmlFor="avatar"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              头像 URL
            </label>
            <input
              type="url"
              id="avatar"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
            />
          </div>

          {formData.avatar && (
            <div className="flex justify-center">
              <img
                src={formData.avatar}
                alt="头像预览"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
              />
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              保存更改
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-200"
            >
              取消
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
