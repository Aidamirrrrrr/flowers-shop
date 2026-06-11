import { fetchActiveProducts } from '@/lib/catalog'
import { prisma } from '@/lib/prisma'
import { ShopProviders } from './shop-providers'

export const dynamic = 'force-dynamic'

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let products: Awaited<ReturnType<typeof fetchActiveProducts>> = []
  let categories: { id: string; label: string }[] = [{ id: 'all', label: 'Все' }]

  try {
    products = await fetchActiveProducts()
    const cats = await prisma.category.findMany({
      orderBy: { sort: 'asc' },
      select: { id: true, label: true },
    })
    categories = [{ id: 'all', label: 'Все' }, ...cats]
  } catch (error) {
    console.error('[shop layout] catalog load failed:', error)
  }

  return (
    <ShopProviders initial={{ products, categories }}>
      {children}
    </ShopProviders>
  )
}
