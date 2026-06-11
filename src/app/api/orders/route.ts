import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { formatOrderDate, orderStatusLabel, shortOrderId } from '@/lib/order-labels'
import { prisma } from '@/lib/prisma'

type OrderItemInput = {
  productId: string
  quantity: number
  postcardText?: string
}

type CreateOrderBody = {
  customerName?: string
  phone?: string
  address?: string
  deliveryAt?: string
  items?: OrderItemInput[]
}

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: { product: { select: { name: true } } },
      },
    },
  })

  return NextResponse.json({
    orders: orders.map((order) => ({
      id: order.id,
      shortId: shortOrderId(order.id),
      title:
        order.items[0]?.product.name ??
        `Заказ из ${order.items.length} товаров`,
      date: formatOrderDate(order.createdAt),
      status: orderStatusLabel(order.status),
      total: order.total,
      itemCount: order.items.reduce((sum, i) => sum + i.quantity, 0),
    })),
  })
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = (await request.json()) as CreateOrderBody
    const customerName = body.customerName?.trim()
    const phone = body.phone?.trim()
    const address = body.address?.trim()
    const deliveryAtRaw = body.deliveryAt?.trim()
    const items = body.items ?? []

    if (!customerName || !phone || !address || !deliveryAtRaw) {
      return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 })
    }

    if (items.length === 0) {
      return NextResponse.json({ error: 'Корзина пуста' }, { status: 400 })
    }

    const deliveryAt = new Date(deliveryAtRaw)
    if (Number.isNaN(deliveryAt.getTime())) {
      return NextResponse.json({ error: 'Некорректная дата доставки' }, { status: 400 })
    }

    const productIds = [...new Set(items.map((i) => i.productId))]
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, active: true },
    })

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: 'Некоторые товары недоступны. Запустите pnpm db:seed' },
        { status: 400 },
      )
    }

    const priceById = new Map(products.map((p) => [p.id, p.price]))

    let total = 0
    const orderItems = items.map((item) => {
      const price = priceById.get(item.productId)!
      const quantity = Math.max(1, Math.floor(item.quantity))
      total += price * quantity
      return {
        productId: item.productId,
        quantity,
        price,
        postcardText: item.postcardText?.trim() || null,
      }
    })

    const order = await prisma.order.create({
      data: {
        userId: session.userId,
        customerName,
        phone,
        address,
        deliveryAt,
        total,
        items: { create: orderItems },
      },
      include: {
        items: { include: { product: { select: { name: true } } } },
      },
    })

    return NextResponse.json({
      order: {
        id: order.id,
        shortId: shortOrderId(order.id),
        total: order.total,
        status: orderStatusLabel(order.status),
        deliveryAt: formatOrderDate(order.deliveryAt),
      },
    })
  } catch (error) {
    console.error('[orders POST]', error)
    return NextResponse.json({ error: 'Не удалось создать заказ' }, { status: 500 })
  }
}
