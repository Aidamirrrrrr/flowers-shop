'use client'

import { useQuery } from '@tanstack/react-query'
import { apiJson } from '@/lib/query/fetch'
import { queryKeys } from '@/lib/query/keys'
import type { CatalogProduct } from '@/types/catalog'

async function fetchCartSuggestions() {
  const data = await apiJson<{ products: CatalogProduct[] }>('/api/cart-suggestions')
  return data.products ?? []
}

export function useCartSuggestionsQuery() {
  return useQuery({
    queryKey: queryKeys.cartSuggestions,
    queryFn: fetchCartSuggestions,
    staleTime: 60_000,
  })
}
