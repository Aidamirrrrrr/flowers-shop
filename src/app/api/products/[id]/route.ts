import { NextResponse } from 'next/server'
import { fetchProductById } from '@/lib/catalog'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const product = await fetchProductById(id)

    if (!product) {
      return NextResponse.json({ error: 'Товар не найден' }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('[GET /api/products/[id]]', error)
    return NextResponse.json({ error: 'Ошибка загрузки товара' }, { status: 500 })
  }
}
