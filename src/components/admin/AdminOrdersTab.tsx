'use client'

import { useState } from 'react'
import { RefreshCw, Trash2 } from 'lucide-react'
import { DeliveryDateTimePicker } from '@/components/cart/DeliveryDateTimePicker'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { formatPrice } from '@/lib/format-price'
import { isoToPickerValue } from '@/lib/order-datetime'
import {
  ORDER_STATUS_LABELS,
  orderStatusLabel,
  type OrderStatusKey,
} from '@/lib/order-status-labels'
import type { AdminOrder } from '@/types/admin'
import { cn } from '@/lib/utils'

const STATUS_OPTIONS = Object.keys(ORDER_STATUS_LABELS) as OrderStatusKey[]

type AdminOrdersTabProps = {
  orders: AdminOrder[]
  loading: boolean
  refreshing: boolean
  onRefresh: () => void
  onStatusChange: (orderId: string, status: OrderStatusKey) => void
  onDeliveryChange: (orderId: string, deliveryAt: string) => void
  onDelete: (orderId: string) => Promise<string | null>
  updatingDeliveryId?: string | null
}

export function AdminOrdersTab({
  orders,
  loading,
  refreshing,
  onRefresh,
  onStatusChange,
  onDeliveryChange,
  onDelete,
  updatingDeliveryId,
}: AdminOrdersTabProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const orderToDelete = orders.find((o) => o.id === deleteId)

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
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {orders.length === 0
            ? 'Новые заказы появятся здесь автоматически'
            : `Всего заказов: ${orders.length}`}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={cn('mr-1.5 h-4 w-4', refreshing && 'animate-spin')} />
          Обновить
        </Button>
      </div>

      {deleteError && (
        <p className="text-sm text-destructive">{deleteError}</p>
      )}

      {orders.length === 0 ? (
        <Card className="border-dashed shadow-none">
          <CardContent className="p-6 text-center text-sm text-muted-foreground">
            Заказов пока нет. Оформите тестовый заказ из корзины — он сразу попадёт в этот список.
          </CardContent>
        </Card>
      ) : (
        orders.map((order) => (
          <Card
            key={order.id}
            className={cn(order.status === 'NEW' && 'border-primary/40 bg-primary/5')}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">№{order.shortId}</CardTitle>
                  {order.status === 'NEW' && <Badge>Новый</Badge>}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <span className="text-xs text-muted-foreground">{order.createdAtLabel}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground"
                    aria-label="Удалить заказ"
                    onClick={() => {
                      setDeleteError(null)
                      setDeleteId(order.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="font-medium">
                {order.customerName} · {order.phone}
              </p>
              {order.userLabel && (
                <p className="text-xs text-muted-foreground">Telegram: {order.userLabel}</p>
              )}
              <p className="text-muted-foreground">{order.address}</p>
              <p>
                <strong className="text-foreground">{formatPrice(order.total)}</strong>
              </p>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} × {item.quantity} ({formatPrice(item.price * item.quantity)})
                    {item.postcardText ? ` · «${item.postcardText}»` : ''}
                  </li>
                ))}
              </ul>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Дата и время доставки</Label>
                <DeliveryDateTimePicker
                  value={isoToPickerValue(order.deliveryAt)}
                  onChange={(value) => onDeliveryChange(order.id, value)}
                  allowPastDates
                  showHint={false}
                />
                {updatingDeliveryId === order.id && (
                  <p className="text-xs text-muted-foreground">Сохраняем…</p>
                )}
              </div>

              <Select
                value={order.status}
                onValueChange={(value) => onStatusChange(order.id, value as OrderStatusKey)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {orderStatusLabel(s)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        ))
      )}

      <AlertDialog open={Boolean(deleteId)} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить заказ?</AlertDialogTitle>
            <AlertDialogDescription>
              {orderToDelete
                ? `Заказ №${orderToDelete.shortId} от ${orderToDelete.customerName} будет удалён безвозвратно.`
                : 'Заказ будет удалён.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Отмена</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
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
