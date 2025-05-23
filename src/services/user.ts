import { User, CreateUserInput, UpdateUserInput } from '@/types/user'
import { DbService } from './db.service'

// 创建用户
export async function createUser(input: CreateUserInput): Promise<User> {
  return DbService.createUser(input)
}

// 获取所有用户
export async function getUsers(): Promise<User[]> {
  return DbService.getUsers()
}

// 根据 ID 获取用户
export async function getUserById(id: string): Promise<User | null> {
  return DbService.getUserById(id)
}

// 更新用户
export async function updateUser(id: string, input: UpdateUserInput): Promise<User | null> {
  return DbService.updateUser(id, input)
}

// 删除用户
export async function deleteUser(id: string): Promise<boolean> {
  return DbService.deleteUser(id)
}

// 搜索用户
export async function searchUsers(query: string): Promise<User[]> {
  return DbService.searchUsers(query)
}
