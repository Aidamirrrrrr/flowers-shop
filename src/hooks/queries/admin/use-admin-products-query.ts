'use client'

import { useQuery } from '@tanstack/react-query'
import { apiJson } from '@/lib/query/fetch'
import { queryKeys } from '@/lib/query/keys'
import type { AdminProduct, ProductFormValues } from '@/types/admin'

async function fetchAdminProducts() {
  const data = await apiJson<{ products: AdminProduct[] }>('/api/admin/products')
  return data.products
}

export function useAdminProductsQuery() {
  return useQuery({
    queryKey: queryKeys.admin.products,
    queryFn: fetchAdminProducts,
    staleTime: 30_000,
  })
}

export function useAdminProductQuery(productId: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.admin.product(productId ?? ''),
    queryFn: async () => {
      const data = await apiJson<{
        product: ProductFormValues & { price: number; image: string }
      }>(`/api/admin/products/${productId}`)
      return data.product
    },
    enabled: enabled && Boolean(productId),
    staleTime: 0,
  })
}
