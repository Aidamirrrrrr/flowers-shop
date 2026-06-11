import { unstable_cache } from 'next/cache'
import { fetchActiveProducts } from '@/lib/catalog'
import { prisma } from '@/lib/prisma'
import type { CatalogCategory, CatalogProduct } from '@/types/catalog'

export type ShopCatalog = {
  products: CatalogProduct[]
  categories: CatalogCategory[]
  fetchedAt: number
}

const EMPTY_CATALOG: ShopCatalog = {
  products: [],
  categories: [{ id: 'all', label: 'Все' }],
  fetchedAt: 0,
}

export const getShopCatalog = unstable_cache(
  async (): Promise<ShopCatalog> => {
    const [products, cats] = await Promise.all([
      fetchActiveProducts(),
      prisma.category.findMany({
        orderBy: { sort: 'asc' },
        select: { id: true, label: true },
      }),
    ])

    return {
      products,
      categories: [{ id: 'all', label: 'Все' }, ...cats],
      fetchedAt: Date.now(),
    }
  },
  ['shop-catalog'],
  { revalidate: 60, tags: ['catalog'] },
)

export async function loadShopCatalog(): Promise<ShopCatalog> {
  try {
    return await getShopCatalog()
  } catch (error) {
    console.error('[shop catalog] load failed:', error)
    return EMPTY_CATALOG
  }
}
