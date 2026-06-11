'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import type { CatalogInitial } from '@/context/CatalogContext'
import { defaultCategories, useCategoriesQuery } from '@/hooks/queries/use-categories-query'
import { useProductsQuery } from '@/hooks/queries/use-products-query'
import { invalidateCatalog } from '@/lib/query/invalidate'

export function useCatalog(initial?: CatalogInitial) {
  const queryClient = useQueryClient()
  const seededAt = initial?.fetchedAt
  const productsQuery = useProductsQuery(initial?.products, seededAt)
  const categoriesQuery = useCategoriesQuery(initial?.categories, seededAt)

  const products = productsQuery.data ?? []
  const categories = categoriesQuery.data ?? defaultCategories
  const loading =
    !initial?.products?.length &&
    !initial?.categories?.length &&
    (productsQuery.isPending || categoriesQuery.isPending)
  const error =
    (productsQuery.error instanceof Error ? productsQuery.error.message : null) ??
    (categoriesQuery.error instanceof Error ? categoriesQuery.error.message : null)

  const refresh = useCallback(async () => {
    await invalidateCatalog(queryClient)
  }, [queryClient])

  const productMap = useMemo(
    () => new Map(products.map((p) => [p.id, p])),
    [products],
  )

  const getProduct = useCallback(
    (id: string) => productMap.get(id),
    [productMap],
  )

  return { products, categories, productMap, getProduct, loading, error, refresh }
}
