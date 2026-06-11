import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { parseProductFormBody, slugifyProductId } from '@/lib/admin-product'
import { prisma } from '@/lib/prisma'

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const products = await prisma.product.findMany({
    orderBy: [{ categoryId: 'asc' }, { name: 'asc' }],
    include: { category: { select: { id: true, label: true } } },
  })

  return NextResponse.json({
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
      categoryId: p.categoryId,
      category: p.category.label,
      description: p.description,
      careTips: p.careTips,
      active: p.active,
    })),
  })
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = (await request.json()) as Record<string, unknown>
    const parsed = parseProductFormBody(body)
    if (typeof parsed === 'string') {
      return NextResponse.json({ error: parsed }, { status: 400 })
    }

    const category = await prisma.category.findUnique({
      where: { id: parsed.categoryId },
    })
    if (!category) {
      return NextResponse.json({ error: 'Категория не найдена' }, { status: 400 })
    }

    const requestedId =
      typeof body.id === 'string' && body.id.trim() ? body.id.trim() : slugifyProductId(parsed.name)

    let id = requestedId
    let suffix = 0
    while (await prisma.product.findUnique({ where: { id } })) {
      suffix += 1
      id = `${requestedId}-${suffix}`
    }

    const product = await prisma.product.create({
      data: { id, ...parsed },
      include: { category: { select: { label: true } } },
    })

    return NextResponse.json({
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        categoryId: product.categoryId,
        category: product.category.label,
        description: product.description,
        careTips: product.careTips,
        active: product.active,
      },
    })
  } catch (error) {
    console.error('[admin/products POST]', error)
    return NextResponse.json({ error: 'Не удалось создать товар' }, { status: 500 })
  }
}
