'use client'

import { useCallback, useEffect, useState } from 'react'
import { AdminCategoriesTab } from '@/components/admin/AdminCategoriesTab'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useCatalogContext } from '@/context/CatalogContext'
import type { AdminCategory } from '@/types/admin'

export function AdminCategoriesPage() {
  const { refresh: refreshCatalog } = useCatalogContext()
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadCategories = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/categories', { credentials: 'include' })
      if (!res.ok) throw new Error('Нет доступа к категориям')
      const data = (await res.json()) as { categories: AdminCategory[] }
      setCategories(data.categories)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadCategories()
  }, [loadCategories])

  const deleteCategory = async (categoryId: string): Promise<string | null> => {
    const res = await fetch(`/api/admin/categories/${categoryId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    const data = (await res.json()) as { error?: string }
    if (!res.ok) return data.error ?? 'Не удалось удалить категорию'
    setCategories((prev) => prev.filter((c) => c.id !== categoryId))
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
      <AdminCategoriesTab
        categories={categories}
        loading={loading}
        onDelete={deleteCategory}
      />
    </div>
  )
}
