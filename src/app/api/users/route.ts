import { NextRequest, NextResponse } from 'next/server'
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  searchUsers,
} from '@/services/user'
import { CreateUserInput, UpdateUserInput } from '@/types/user'

// GET /api/users - 获取所有用户
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')

  if (query) {
    const users = await searchUsers(query)
    return NextResponse.json(users)
  }

  const users = await getUsers()
  return NextResponse.json(users)
}

// POST /api/users - 创建用户
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const user = await createUser(body as CreateUserInput)
    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: '创建用户失败' }, { status: 400 })
  }
}

// GET /api/users/[id] - 获取单个用户
export async function GET_BY_ID(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserById(params.id)
  if (!user) {
    return NextResponse.json({ error: '用户不存在' }, { status: 404 })
  }
  return NextResponse.json(user)
}

// PATCH /api/users/[id] - 更新用户
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const user = await updateUser(params.id, body as UpdateUserInput)
    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: '更新用户失败' }, { status: 400 })
  }
}

// DELETE /api/users/[id] - 删除用户
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const success = await deleteUser(params.id)
  if (!success) {
    return NextResponse.json({ error: '用户不存在' }, { status: 404 })
  }
  return new NextResponse(null, { status: 204 })
}
