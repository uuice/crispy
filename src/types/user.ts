import { User, Role, Permission } from '../prisma'

// 用户相关类型
export type { User, Role, Permission }

// 创建用户输入类型
export type CreateUserInput = Omit<
  User,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'lastLoginAt' | 'lastLoginIp' | 'roles'
>

// 更新用户输入类型
export type UpdateUserInput = Partial<CreateUserInput>

// 用户状态类型
export type UserStatus = 'active' | 'inactive' | 'banned'

// 角色相关类型
export type CreateRoleInput = Omit<
  Role,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'permissions' | 'users'
>

// 更新角色输入类型
export type UpdateRoleInput = Partial<CreateRoleInput>

// 角色状态类型
export type RoleStatus = 'active' | 'inactive'

// 权限相关类型
export type CreatePermissionInput = Omit<
  Permission,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'roles'
>

// 更新权限输入类型
export type UpdatePermissionInput = Partial<CreatePermissionInput>

// 权限状态类型
export type PermissionStatus = 'active' | 'inactive'

// 权限类型
export type PermissionType = 'menu' | 'operation' | 'data'

// 分页查询参数
export interface PaginationParams {
  page?: number
  pageSize?: number
  orderBy?: string
  order?: 'asc' | 'desc'
}

// 分页响应
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 通用响应类型
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 用户查询参数
export interface UserQueryParams extends PaginationParams {
  search?: string
  status?: UserStatus
  roleId?: string
}

// 角色查询参数
export interface RoleQueryParams extends PaginationParams {
  search?: string
  status?: RoleStatus
}

// 权限查询参数
export interface PermissionQueryParams extends PaginationParams {
  search?: string
  status?: PermissionStatus
  type?: PermissionType
}

// 用户登录输入
export interface LoginInput {
  email: string
  password: string
}

// 用户登录响应
export interface LoginResponse {
  token: string
  user: User
  roles: Role[]
  permissions: Permission[]
}

// 用户注册输入
export interface RegisterInput extends CreateUserInput {
  confirmPassword: string
}

// 修改密码输入
export interface ChangePasswordInput {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

// 重置密码输入
export interface ResetPasswordInput {
  email: string
  code: string
  newPassword: string
  confirmPassword: string
}

// 用户会话信息
export interface UserSession {
  id: string
  email: string
  name: string
  roles: string[]
  permissions: string[]
  lastLoginAt: Date
  lastLoginIp: string
}
