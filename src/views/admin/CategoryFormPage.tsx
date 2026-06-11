'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import type { CategoryFormValues } from '@/types/admin'
import { EMPTY_CATEGORY_FORM } from '@/types/admin'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { useCatalogContext } from '@/context/CatalogContext'

type CategoryFormPageProps = {
  mode: 'create' | 'edit'
  categoryId?: string
}

export function CategoryFormPage({ mode, categoryId }: CategoryFormPageProps) {
  const router = useRouter()
  const { refresh: refreshCatalog } = useCatalogContext()
  const [form, setForm] = useState<CategoryFormValues>(EMPTY_CATEGORY_FORM)
  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (mode === 'create') return
    if (!categoryId) return

    setLoading(true)
    fetch('/api/admin/categories', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error('Не удалось загрузить категорию')
        const data = (await res.json()) as {
          categories: { id: string; label: string; sort: number }[]
        }
        const category = data.categories.find((c) => c.id === categoryId)
        if (!category) throw new Error('Категория не найдена')
        setForm({ label: category.label, sort: String(category.sort) })
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки')
      })
      .finally(() => setLoading(false))
  }, [mode, categoryId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload: Record<string, unknown> = { label: form.label.trim() }
    if (form.sort.trim()) {
      payload.sort = Number(form.sort)
    }

    try {
      const url = mode === 'create' ? '/api/admin/categories' : `/api/admin/categories/${categoryId}`
      const res = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        throw new Error(data.error ?? 'Не удалось сохранить')
      }
      await refreshCatalog()
      router.push('/admin/categories')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <Skeleton className="h-40 w-full" />
  }

  return (
    <div className="space-y-4 pb-6">
      <PageHeader title={mode === 'create' ? 'Новая категория' : 'Редактировать категорию'}>
        <Button variant="ghost" size="sm" className="ml-auto" asChild>
          <Link href="/admin/categories">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Назад
          </Link>
        </Button>
      </PageHeader>

      {mode === 'edit' && categoryId && (
        <p className="text-sm text-muted-foreground">ID: {categoryId}</p>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form className="space-y-4" onSubmit={(e) => void handleSubmit(e)}>
        <div className="space-y-2">
          <Label htmlFor="category-label">Название</Label>
          <Input
            id="category-label"
            value={form.label}
            onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
            placeholder="Пионы"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category-sort">Порядок в каталоге</Label>
          <Input
            id="category-sort"
            type="number"
            value={form.sort}
            onChange={(e) => setForm((p) => ({ ...p, sort: e.target.value }))}
            placeholder="Авто"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="button" variant="outline" className="flex-1" asChild>
            <Link href="/admin/categories">Отмена</Link>
          </Button>
          <Button type="submit" className="flex-1" disabled={saving}>
            {saving ? 'Сохраняем…' : mode === 'create' ? 'Создать' : 'Сохранить'}
          </Button>
        </div>
      </form>
    </div>
  )
}
