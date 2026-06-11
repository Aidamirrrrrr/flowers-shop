'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { CatalogInitial } from '@/context/CatalogContext'
import type { CatalogCategory, CatalogProduct } from '@/types/catalog'

export function useCatalog(initial?: CatalogInitial) {
  const [products, setProducts] = useState<CatalogProduct[]>(initial?.products ?? [])
  const [categories, setCategories] = useState<CatalogCategory[]>(
    initial?.categories ?? [{ id: 'all', label: 'Все' }],
  )
  const [loading, setLoading] = useState(!(initial?.products && initial.products.length > 0))
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (initial?.products?.length) {
      setLoading(false)
    } else {
      setLoading(true)
    }
    setError(null)
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
      ])
      if (!productsRes.ok || !categoriesRes.ok) {
        throw new Error('Не удалось загрузить каталог')
      }
      const productsData = (await productsRes.json()) as { products: CatalogProduct[] }
      const categoriesData = (await categoriesRes.json()) as { categories: CatalogCategory[] }
      setProducts(productsData.products)
      setCategories(categoriesData.categories)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки')
    } finally {
      setLoading(false)
    }
  }, [initial?.products?.length])

  useEffect(() => {
    void refresh()
  }, [refresh])

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
