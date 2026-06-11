import { NextResponse } from 'next/server'
import { fetchActiveProducts } from '@/lib/catalog'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('category')
    const q = searchParams.get('q')?.trim().toLowerCase()

    let products = await fetchActiveProducts()

    if (categoryId && categoryId !== 'all') {
      products = products.filter((p) => p.categoryId === categoryId)
    }

    if (q) {
      products = products.filter((p) => p.name.toLowerCase().includes(q))
    }

    return NextResponse.json({ products })
  } catch (error) {
    console.error('[GET /api/products]', error)
    return NextResponse.json({ error: 'Ошибка загрузки каталога' }, { status: 500 })
  }
}
