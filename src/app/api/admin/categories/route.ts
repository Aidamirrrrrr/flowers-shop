import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { parseCategoryBody, slugifyCategoryId } from '@/lib/admin-category'
import { prisma } from '@/lib/prisma'

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const categories = await prisma.category.findMany({
    orderBy: { sort: 'asc' },
    include: { _count: { select: { products: true } } },
  })

  return NextResponse.json({
    categories: categories.map((c) => ({
      id: c.id,
      label: c.label,
      sort: c.sort,
      productCount: c._count.products,
    })),
  })
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = (await request.json()) as Record<string, unknown>
    const parsed = parseCategoryBody(body)
    if (typeof parsed === 'string') {
      return NextResponse.json({ error: parsed }, { status: 400 })
    }

    const requestedId =
      typeof body.id === 'string' && body.id.trim()
        ? body.id.trim().toLowerCase()
        : slugifyCategoryId(parsed.label)

    let id = requestedId
    let suffix = 0
    while (await prisma.category.findUnique({ where: { id } })) {
      suffix += 1
      id = `${requestedId}-${suffix}`
    }

    const maxSort = await prisma.category.aggregate({ _max: { sort: true } })
    const sort = parsed.sort ?? (maxSort._max.sort ?? 0) + 1

    const category = await prisma.category.create({
      data: { id, label: parsed.label, sort },
      include: { _count: { select: { products: true } } },
    })

    return NextResponse.json({
      category: {
        id: category.id,
        label: category.label,
        sort: category.sort,
        productCount: category._count.products,
      },
    })
  } catch (error) {
    console.error('[admin/categories POST]', error)
    return NextResponse.json({ error: 'Не удалось создать категорию' }, { status: 500 })
  }
}
