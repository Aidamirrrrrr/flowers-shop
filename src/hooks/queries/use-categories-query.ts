'use client'

import { useQuery } from '@tanstack/react-query'
import { apiJson } from '@/lib/query/fetch'
import { queryKeys } from '@/lib/query/keys'
import type { CatalogCategory } from '@/types/catalog'

const FALLBACK: CatalogCategory[] = [{ id: 'all', label: 'Все' }]

async function fetchCategories() {
  const data = await apiJson<{ categories: CatalogCategory[] }>('/api/categories')
  return data.categories
}

export function useCategoriesQuery(initialData?: CatalogCategory[]) {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: fetchCategories,
    initialData: initialData?.length ? initialData : undefined,
    staleTime: 60_000,
  })
}

export { FALLBACK as defaultCategories }
