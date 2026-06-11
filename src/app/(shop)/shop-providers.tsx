'use client'

import { CartProvider } from '@/context/CartContext'
import { CatalogProvider } from '@/context/CatalogContext'
import { SessionProvider } from '@/context/SessionContext'
import { ShopShell } from '@/components/layout/ShopShell'
import type { CatalogCategory, CatalogProduct } from '@/types/catalog'

type ShopProvidersProps = {
  children: React.ReactNode
  initial: {
    products: CatalogProduct[]
    categories: CatalogCategory[]
    fetchedAt: number
  }
}

export function ShopProviders({ children, initial }: ShopProvidersProps) {
  return (
    <SessionProvider>
      <CatalogProvider initial={initial}>
        <CartProvider>
          <ShopShell>{children}</ShopShell>
        </CartProvider>
      </CatalogProvider>
    </SessionProvider>
  )
}
