import { loadShopCatalog } from '@/lib/catalog-ssr'
import { ShopProviders } from './shop-providers'

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const catalog = await loadShopCatalog()

  return (
    <ShopProviders
      initial={{
        products: catalog.products,
        categories: catalog.categories,
        fetchedAt: catalog.fetchedAt,
      }}
    >
      {children}
    </ShopProviders>
  )
}
