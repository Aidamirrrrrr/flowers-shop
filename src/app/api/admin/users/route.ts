import { NextResponse } from 'next/server'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const users = await prisma.user.findMany({
    orderBy: [{ role: 'asc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      telegramId: true,
      username: true,
      firstName: true,
      lastName: true,
      role: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
  })

  return NextResponse.json({
    users: users.map((user) => ({
      id: user.id,
      telegramId: user.telegramId.toString(),
      username: user.username,
      displayName:
        [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Без имени',
      role: user.role,
      orderCount: user._count.orders,
      createdAtLabel: format(user.createdAt, 'd MMM yyyy', { locale: ru }),
    })),
  })
}
