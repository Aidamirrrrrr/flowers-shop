'use client'

import { useQuery } from '@tanstack/react-query'
import { apiJson } from '@/lib/query/fetch'
import { queryKeys } from '@/lib/query/keys'
import type { CatalogProduct } from '@/types/catalog'

async function fetchProducts() {
  const data = await apiJson<{ products: CatalogProduct[] }>('/api/products')
  return data.products
}

export function useProductsQuery(initialData?: CatalogProduct[], seededAt?: number) {
  const hasSeed = Boolean(initialData?.length && seededAt)

  return useQuery({
    queryKey: queryKeys.products,
    queryFn: fetchProducts,
    initialData: hasSeed ? initialData : undefined,
    initialDataUpdatedAt: hasSeed ? seededAt : undefined,
    staleTime: 60_000,
    refetchOnMount: hasSeed ? false : undefined,
  })
}
