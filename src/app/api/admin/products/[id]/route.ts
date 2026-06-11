import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await context.params
  const body = (await request.json()) as { active?: boolean; price?: number }

  const data: { active?: boolean; price?: number } = {}
  if (typeof body.active === 'boolean') data.active = body.active
  if (typeof body.price === 'number' && body.price > 0) data.price = Math.round(body.price)

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'Нет данных для обновления' }, { status: 400 })
  }

  const product = await prisma.product.update({
    where: { id },
    data,
  })

  return NextResponse.json({
    product: {
      id: product.id,
      name: product.name,
      price: product.price,
      active: product.active,
    },
  })
}
