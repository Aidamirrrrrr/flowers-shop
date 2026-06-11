'use client'

import { useQuery } from '@tanstack/react-query'
import { apiJson } from '@/lib/query/fetch'
import { queryKeys } from '@/lib/query/keys'
import type { AdminCategory } from '@/types/admin'

async function fetchAdminCategories() {
  const data = await apiJson<{ categories: AdminCategory[] }>('/api/admin/categories')
  return data.categories
}

export function useAdminCategoriesQuery() {
  return useQuery({
    queryKey: queryKeys.admin.categories,
    queryFn: fetchAdminCategories,
    staleTime: 30_000,
  })
}

export function useAdminCategoryQuery(categoryId: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.admin.category(categoryId ?? ''),
    queryFn: async () => {
      const data = await apiJson<{ categories: AdminCategory[] }>('/api/admin/categories')
      const category = data.categories.find((c) => c.id === categoryId)
      if (!category) throw new Error('Категория не найдена')
      return category
    },
    enabled: enabled && Boolean(categoryId),
    staleTime: 0,
  })
}
