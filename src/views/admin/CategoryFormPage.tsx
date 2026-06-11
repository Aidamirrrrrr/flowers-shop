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
import { useAdminCategoryQuery } from '@/hooks/queries/admin/use-admin-categories-query'
import { useSaveCategoryMutation } from '@/hooks/queries/admin/use-admin-mutations'

type CategoryFormPageProps = {
  mode: 'create' | 'edit'
  categoryId?: string
}

export function CategoryFormPage({ mode, categoryId }: CategoryFormPageProps) {
  const router = useRouter()
  const saveCategory = useSaveCategoryMutation()
  const categoryQuery = useAdminCategoryQuery(categoryId, mode === 'edit')
  const [form, setForm] = useState<CategoryFormValues>(EMPTY_CATEGORY_FORM)
  const [error, setError] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(mode === 'create')

  useEffect(() => {
    if (mode !== 'edit' || !categoryQuery.data) return
    setForm({
      label: categoryQuery.data.label,
      sort: String(categoryQuery.data.sort),
    })
    setInitialized(true)
  }, [mode, categoryQuery.data])

  useEffect(() => {
    if (categoryQuery.error) {
      setError(
        categoryQuery.error instanceof Error ? categoryQuery.error.message : 'Ошибка загрузки',
      )
    }
  }, [categoryQuery.error])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const payload: Record<string, unknown> = { label: form.label.trim() }
    if (form.sort.trim()) {
      payload.sort = Number(form.sort)
    }

    try {
      await saveCategory.mutateAsync({ mode, categoryId, payload })
      router.push('/admin/categories')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения')
    }
  }

  const loading = mode === 'edit' && (categoryQuery.isPending || !initialized)

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
          <Button type="submit" className="flex-1" disabled={saveCategory.isPending}>
            {saveCategory.isPending ? 'Сохраняем…' : mode === 'create' ? 'Создать' : 'Сохранить'}
          </Button>
        </div>
      </form>
    </div>
  )
}
