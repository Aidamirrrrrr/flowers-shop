'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { useCatalog } from '@/hooks/useCatalog'
import type { CatalogCategory, CatalogProduct } from '@/types/catalog'

export type CatalogInitial = {
  products: CatalogProduct[]
  categories: CatalogCategory[]
}

type CatalogContextValue = {
  products: CatalogProduct[]
  categories: CatalogCategory[]
  getProduct: (id: string) => CatalogProduct | undefined
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

const CatalogContext = createContext<CatalogContextValue | null>(null)

export function CatalogProvider({
  children,
  initial,
}: {
  children: ReactNode
  initial?: CatalogInitial
}) {
  const catalog = useCatalog(initial)
  return <CatalogContext.Provider value={catalog}>{children}</CatalogContext.Provider>
}

export function useCatalogContext() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalogContext must be used within CatalogProvider')
  return ctx
}
