'use client'

import { useCallback, useEffect, useState } from 'react'
import { AdminProductsTab } from '@/components/admin/AdminProductsTab'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useCatalogContext } from '@/context/CatalogContext'
import type { AdminProduct } from '@/types/admin'

export function AdminProductsPage() {
  const { refresh: refreshCatalog } = useCatalogContext()
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProducts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/products', { credentials: 'include' })
      if (!res.ok) throw new Error('Нет доступа к товарам')
      const data = (await res.json()) as { products: AdminProduct[] }
      setProducts(data.products)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadProducts()
  }, [loadProducts])

  const toggleProduct = async (productId: string, active: boolean) => {
    const res = await fetch(`/api/admin/products/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ active }),
    })
    if (!res.ok) return
    const data = (await res.json()) as { product: AdminProduct }
    setProducts((prev) => prev.map((p) => (p.id === productId ? data.product : p)))
    void refreshCatalog()
  }

  const deleteProduct = async (productId: string): Promise<string | null> => {
    const res = await fetch(`/api/admin/products/${productId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    const data = (await res.json()) as { error?: string }
    if (!res.ok) return data.error ?? 'Не удалось удалить товар'
    setProducts((prev) => prev.filter((p) => p.id !== productId))
    void refreshCatalog()
    return null
  }

  return (
    <div className="mt-4 space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <AdminProductsTab
        products={products}
        loading={loading}
        onToggleActive={(id, active) => void toggleProduct(id, active)}
        onDelete={deleteProduct}
      />
    </div>
  )
}
