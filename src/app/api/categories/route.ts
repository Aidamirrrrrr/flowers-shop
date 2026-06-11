import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sort: 'asc' },
      select: { id: true, label: true },
    })

    return NextResponse.json({
      categories: [{ id: 'all', label: 'Все' }, ...categories],
    })
  } catch (error) {
    console.error('[GET /api/categories]', error)
    return NextResponse.json({ error: 'Ошибка загрузки категорий' }, { status: 500 })
  }
}
