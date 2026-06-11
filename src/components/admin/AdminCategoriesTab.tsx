'use client'

import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import type { AdminCategory } from '@/types/admin'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'

type AdminCategoriesTabProps = {
  categories: AdminCategory[]
  loading: boolean
  onCreate: () => void
  onEdit: (categoryId: string) => void
  onDelete: (categoryId: string) => Promise<string | null>
}

export function AdminCategoriesTab({
  categories,
  loading,
  onCreate,
  onEdit,
  onDelete,
}: AdminCategoriesTabProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const categoryToDelete = categories.find((c) => c.id === deleteId)

  const confirmDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    setDeleteError(null)
    const err = await onDelete(deleteId)
    setDeleting(false)
    if (err) {
      setDeleteError(err)
      return
    }
    setDeleteId(null)
  }

  if (loading) {
    return <Skeleton className="h-40 w-full rounded-lg" />
  }

  return (
    <div className="space-y-3">
      {deleteError && (
        <Alert variant="destructive">
          <AlertDescription>{deleteError}</AlertDescription>
        </Alert>
      )}

      <Button type="button" className="w-full" onClick={onCreate}>
        <Plus className="mr-2 h-4 w-4" />
        Добавить категорию
      </Button>

      {categories.length === 0 ? (
        <Card className="border-dashed shadow-none">
          <CardContent className="p-6 text-center text-sm text-muted-foreground">
            Категорий нет. Создайте первую или запустите <strong>pnpm db:seed</strong>.
          </CardContent>
        </Card>
      ) : (
        categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="flex items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="font-medium">{category.label}</p>
                <p className="text-xs text-muted-foreground">
                  {category.id} · порядок {category.sort}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge variant="secondary">{category.productCount} тов.</Badge>
                <Button type="button" variant="outline" size="icon" onClick={() => onEdit(category.id)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setDeleteError(null)
                    setDeleteId(category.id)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      <AlertDialog open={Boolean(deleteId)} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить категорию?</AlertDialogTitle>
            <AlertDialogDescription>
              {categoryToDelete
                ? `«${categoryToDelete.label}» будет удалена безвозвратно.`
                : 'Категория будет удалена.'}
              {categoryToDelete && categoryToDelete.productCount > 0
                ? ` В ней ${categoryToDelete.productCount} товар(ов) — сначала перенесите или удалите их.`
                : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Отмена</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting || (categoryToDelete?.productCount ?? 0) > 0}
              onClick={(e) => {
                e.preventDefault()
                void confirmDelete()
              }}
            >
              {deleting ? 'Удаляем…' : 'Удалить'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
