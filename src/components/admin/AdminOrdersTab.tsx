'use client'

import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatPrice } from '@/lib/format-price'
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
}

export function AdminOrdersTab({
  orders,
  loading,
  refreshing,
  onRefresh,
  onStatusChange,
}: AdminOrdersTabProps) {
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
                <span className="shrink-0 text-xs text-muted-foreground">{order.createdAtLabel}</span>
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
                Доставка: {order.deliveryAtLabel} ·{' '}
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
    </div>
  )
}
