import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { formatOrderDate, formatOrderDateTime, orderStatusLabel, shortOrderId } from '@/lib/order-labels'
import { prisma } from '@/lib/prisma'

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { firstName: true, lastName: true, username: true } },
      items: {
        include: { product: { select: { name: true } } },
      },
    },
  })

  return NextResponse.json({
    orders: orders.map((order) => ({
      id: order.id,
      shortId: shortOrderId(order.id),
      status: order.status,
      statusLabel: orderStatusLabel(order.status),
      customerName: order.customerName,
      phone: order.phone,
      address: order.address,
      deliveryAt: order.deliveryAt.toISOString(),
      deliveryAtLabel: formatOrderDateTime(order.deliveryAt),
      createdAtLabel: formatOrderDate(order.createdAt),
      total: order.total,
      items: order.items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        postcardText: item.postcardText,
      })),
      userLabel: order.user
        ? [order.user.firstName, order.user.lastName].filter(Boolean).join(' ') ||
          (order.user.username ? `@${order.user.username}` : 'Клиент')
        : 'Гость',
    })),
  })
}
