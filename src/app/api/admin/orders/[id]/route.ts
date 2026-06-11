import { NextResponse } from 'next/server'
import type { OrderStatus } from '@/generated/prisma/client'
import { requireAdmin } from '@/lib/admin'
import { formatOrderDateTime, orderStatusLabel, shortOrderId } from '@/lib/order-labels'
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
  const body = (await request.json()) as { status?: string; deliveryAt?: string }

  const data: { status?: OrderStatus; deliveryAt?: Date } = {}

  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status as OrderStatus)) {
      return NextResponse.json({ error: 'Некорректный статус' }, { status: 400 })
    }
    data.status = body.status as OrderStatus
  }

  if (body.deliveryAt !== undefined) {
    const deliveryAt = new Date(body.deliveryAt)
    if (Number.isNaN(deliveryAt.getTime())) {
      return NextResponse.json({ error: 'Некорректная дата доставки' }, { status: 400 })
    }
    data.deliveryAt = deliveryAt
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'Нечего обновлять' }, { status: 400 })
  }

  const order = await prisma.order.update({
    where: { id },
    data,
  })

  return NextResponse.json({
    order: {
      id: order.id,
      shortId: shortOrderId(order.id),
      status: order.status,
      statusLabel: orderStatusLabel(order.status),
      deliveryAt: order.deliveryAt.toISOString(),
      deliveryAtLabel: formatOrderDateTime(order.deliveryAt),
    },
  })
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await context.params

  await prisma.order.delete({ where: { id } })

  return NextResponse.json({ ok: true })
}
