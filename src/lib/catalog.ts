import type { CatalogProduct } from '@/types/catalog'
import { prisma } from '@/lib/prisma'

export function mapProduct(p: {
  id: string
  name: string
  price: number
  image: string
  categoryId: string
  description: string
  careTips: string
  active: boolean
  category: { label: string }
}): CatalogProduct {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    categoryId: p.categoryId,
    categoryLabel: p.category.label,
    description: p.description,
    careTips: p.careTips,
    active: p.active,
  }
}

export async function fetchActiveProducts(): Promise<CatalogProduct[]> {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: [{ categoryId: 'asc' }, { name: 'asc' }],
    include: { category: { select: { label: true } } },
  })
  return products.map(mapProduct)
}

export async function fetchProductById(id: string): Promise<CatalogProduct | null> {
  const product = await prisma.product.findFirst({
    where: { id, active: true },
    include: { category: { select: { label: true } } },
  })
  return product ? mapProduct(product) : null
}
