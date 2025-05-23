import { prisma } from '@/lib/prisma'
import { User, CreateUserInput, UpdateUserInput } from '@/types/user'

export class DbService {
  // 创建用户
  static async createUser(input: CreateUserInput): Promise<User> {
    const user = await prisma.user.create({
      data: input,
    })
    return user
  }

  // 获取所有用户
  static async getUsers(): Promise<User[]> {
    return prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  // 根据 ID 获取用户
  static async getUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    })
  }

  // 更新用户
  static async updateUser(id: string, input: UpdateUserInput): Promise<User | null> {
    try {
      return await prisma.user.update({
        where: { id },
        data: input,
      })
    } catch (error) {
      if (error.code === 'P2025') return null // 记录不存在
      throw error
    }
  }

  // 删除用户
  static async deleteUser(id: string): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { id },
      })
      return true
    } catch (error) {
      if (error.code === 'P2025') return false // 记录不存在
      throw error
    }
  }

  // 搜索用户
  static async searchUsers(query: string): Promise<User[]> {
    const searchTerm = query.toLowerCase()
    return prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { email: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }
}
