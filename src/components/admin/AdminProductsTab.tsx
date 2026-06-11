'use client'

import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import type { AdminProduct } from '@/types/admin'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/format-price'
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

type AdminProductsTabProps = {
  products: AdminProduct[]
  loading: boolean
  onCreate: () => void
  onEdit: (productId: string) => void
  onToggleActive: (productId: string, active: boolean) => void
  onDelete: (productId: string) => Promise<string | null>
}

export function AdminProductsTab({
  products,
  loading,
  onCreate,
  onEdit,
  onToggleActive,
  onDelete,
}: AdminProductsTabProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const productToDelete = products.find((p) => p.id === deleteId)

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
        Добавить товар
      </Button>

      {products.length === 0 ? (
        <Card className="border-dashed shadow-none">
          <CardContent className="p-6 text-center text-sm text-muted-foreground">
            Товаров нет. Создайте первый или запустите <strong>pnpm db:seed</strong>.
          </CardContent>
        </Card>
      ) : (
        products.map((product) => (
          <Card key={product.id}>
            <CardContent className="flex gap-3 p-4">
              <img
                src={product.image}
                alt=""
                className="h-16 w-16 shrink-0 rounded-md object-cover bg-muted"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.category} · {formatPrice(product.price)}
                    </p>
                  </div>
                  <Badge variant={product.active ? 'default' : 'secondary'} className="shrink-0">
                    {product.active ? 'В каталоге' : 'Скрыт'}
                  </Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => onEdit(product.id)}>
                    <Pencil className="mr-1.5 h-3.5 w-3.5" />
                    Изменить
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onToggleActive(product.id, !product.active)}
                  >
                    {product.active ? 'Скрыть' : 'Показать'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDeleteError(null)
                      setDeleteId(product.id)
                    }}
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    Удалить
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      <AlertDialog open={Boolean(deleteId)} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить товар?</AlertDialogTitle>
            <AlertDialogDescription>
              {productToDelete
                ? `«${productToDelete.name}» будет удалён вместе с фото на сервере.`
                : 'Товар будет удалён.'}{' '}
              Если товар уже в заказах — удаление невозможно, используйте «Скрыть».
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Отмена</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              className="bg-destructive text-white hover:bg-destructive/90"
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
