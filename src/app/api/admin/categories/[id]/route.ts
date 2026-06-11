import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { parseCategoryBody } from '@/lib/admin-category'
import { prisma } from '@/lib/prisma'

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await context.params

  try {
    const body = (await request.json()) as Record<string, unknown>
    const parsed = parseCategoryBody(body)
    if (typeof parsed === 'string') {
      return NextResponse.json({ error: parsed }, { status: 400 })
    }

    const data: { label: string; sort?: number } = { label: parsed.label }
    if (parsed.sort !== undefined) data.sort = parsed.sort

    const category = await prisma.category.update({
      where: { id },
      data,
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
    console.error('[admin/categories PATCH]', error)
    return NextResponse.json({ error: 'Не удалось обновить категорию' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await context.params

  try {
    const productCount = await prisma.product.count({ where: { categoryId: id } })
    if (productCount > 0) {
      return NextResponse.json(
        { error: `В категории ${productCount} товар(ов). Сначала удалите или перенесите их.` },
        { status: 409 },
      )
    }

    await prisma.category.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[admin/categories DELETE]', error)
    return NextResponse.json({ error: 'Не удалось удалить категорию' }, { status: 500 })
  }
}
