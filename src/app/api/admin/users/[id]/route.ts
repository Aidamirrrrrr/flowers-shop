import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { COOKIE_NAME, createSessionToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, context: RouteContext) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await context.params
  const body = (await request.json()) as { role?: string }

  if (body.role !== 'ADMIN' && body.role !== 'USER') {
    return NextResponse.json({ error: 'Укажите роль ADMIN или USER' }, { status: 400 })
  }

  if (id === session.userId && body.role === 'USER') {
    return NextResponse.json(
      { error: 'Нельзя снять права администратора с самого себя' },
      { status: 400 },
    )
  }

  const user = await prisma.user.update({
    where: { id },
    data: { role: body.role },
    select: {
      id: true,
      telegramId: true,
      username: true,
      firstName: true,
      lastName: true,
      role: true,
    },
  })

  const response = NextResponse.json({
    user: {
      id: user.id,
      telegramId: user.telegramId.toString(),
      username: user.username,
      displayName:
        [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Без имени',
      role: user.role,
    },
  })

  if (id === session.userId) {
    const token = await createSessionToken({ userId: user.id, role: user.role })
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    })
  }

  return response
}
