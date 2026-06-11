import { NextResponse } from 'next/server'
import type { OrderStatus } from '@/generated/prisma/client'
import { requireAdmin } from '@/lib/admin'
import { orderStatusLabel, shortOrderId } from '@/lib/order-labels'
import { prisma } from '@/lib/prisma'

const STATUSES: OrderStatus[] = [
  'NEW',
  'CONFIRMED',
  'DELIVERING',
  'DELIVERED',
  'CANCELLED',
]

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await context.params
  const body = (await request.json()) as { status?: string }

  if (!body.status || !STATUSES.includes(body.status as OrderStatus)) {
    return NextResponse.json({ error: 'Некорректный статус' }, { status: 400 })
  }

  const order = await prisma.order.update({
    where: { id },
    data: { status: body.status as OrderStatus },
  })

  return NextResponse.json({
    order: {
      id: order.id,
      shortId: shortOrderId(order.id),
      status: order.status,
      statusLabel: orderStatusLabel(order.status),
    },
  })
}
