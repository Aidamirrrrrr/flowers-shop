import { NextResponse } from 'next/server'
import { mapProduct } from '@/lib/catalog'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const suggestions = await prisma.cartSuggestion.findMany({
      orderBy: { sort: 'asc' },
      include: {
        product: {
          include: { category: { select: { label: true } } },
        },
      },
    })

    const products = suggestions
      .map((s) => s.product)
      .filter((p) => p.active)
      .map(mapProduct)

    return NextResponse.json({ products })
  } catch (error) {
    console.error('[GET /api/cart-suggestions]', error)
    return NextResponse.json({ error: 'Ошибка загрузки рекомендаций' }, { status: 500 })
  }
}
