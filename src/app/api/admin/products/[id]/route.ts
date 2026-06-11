import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { parseProductFormBody } from '@/lib/admin-product'
import { prisma } from '@/lib/prisma'
import { deleteLocalUpload } from '@/lib/uploads'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, context: RouteContext) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await context.params
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: { select: { id: true, label: true } } },
  })

  if (!product) {
    return NextResponse.json({ error: 'Товар не найден' }, { status: 404 })
  }

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
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await context.params

  try {
    const body = (await request.json()) as Record<string, unknown>

    if (
      body.active !== undefined &&
      Object.keys(body).length === 1 &&
      typeof body.active === 'boolean'
    ) {
      const product = await prisma.product.update({
        where: { id },
        data: { active: body.active },
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
    }

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

    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Товар не найден' }, { status: 404 })
    }

    const product = await prisma.product.update({
      where: { id },
      data: parsed,
      include: { category: { select: { label: true } } },
    })

    if (existing.image !== product.image) {
      await deleteLocalUpload(existing.image)
    }

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
    console.error('[admin/products PATCH]', error)
    return NextResponse.json({ error: 'Не удалось обновить товар' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await context.params

  try {
    const orderItems = await prisma.orderItem.count({ where: { productId: id } })
    if (orderItems > 0) {
      return NextResponse.json(
        { error: 'Товар есть в заказах — удалить нельзя. Скройте его из каталога.' },
        { status: 409 },
      )
    }

    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) {
      return NextResponse.json({ error: 'Товар не найден' }, { status: 404 })
    }

    await prisma.product.delete({ where: { id } })
    await deleteLocalUpload(product.image)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[admin/products DELETE]', error)
    return NextResponse.json({ error: 'Не удалось удалить товар' }, { status: 500 })
  }
}
