import { NextRequest, NextResponse } from 'next/server'
import { getUserById, updateUser, deleteUser } from '@/services/user'
import { UpdateUserInput } from '@/types/user'

// GET /api/users/[id] - 获取单个用户
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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
