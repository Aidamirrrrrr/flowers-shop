'use client'

import { useEffect, useState } from 'react'
import type { AdminCategory, CategoryFormValues } from '@/types/admin'
import { EMPTY_CATEGORY_FORM } from '@/types/admin'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

type CategoryFormDialogProps = {
  open: boolean
  mode: 'create' | 'edit'
  categoryId?: string
  categories: AdminCategory[]
  onOpenChange: (open: boolean) => void
  onSaved: (category: AdminCategory) => void
}

export function CategoryFormDialog({
  open,
  mode,
  categoryId,
  categories,
  onOpenChange,
  onSaved,
}: CategoryFormDialogProps) {
  const [form, setForm] = useState<CategoryFormValues>(EMPTY_CATEGORY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setError(null)

    if (mode === 'create') {
      setForm(EMPTY_CATEGORY_FORM)
      return
    }

    const category = categories.find((c) => c.id === categoryId)
    if (category) {
      setForm({
        label: category.label,
        sort: String(category.sort),
      })
    }
  }, [open, mode, categoryId, categories])

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
      const data = (await res.json()) as { category?: AdminCategory; error?: string }
      if (!res.ok || !data.category) {
        throw new Error(data.error ?? 'Не удалось сохранить')
      }
      onSaved(data.category)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Новая категория' : 'Редактировать категорию'}</DialogTitle>
          <DialogDescription>
            {mode === 'edit' && categoryId ? `ID: ${categoryId}` : 'ID создаётся автоматически из названия.'}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form id="category-form" className="space-y-4" onSubmit={(e) => void handleSubmit(e)}>
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
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button type="submit" form="category-form" disabled={saving}>
            {saving ? 'Сохраняем…' : mode === 'create' ? 'Создать' : 'Сохранить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
