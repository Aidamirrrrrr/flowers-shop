import type { OrderStatus } from '@/generated/prisma/client'
import { orderStatusLabel as label } from '@/lib/order-status-labels'

export function orderStatusLabel(status: OrderStatus): string {
  return label(status)
}

export function formatOrderDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function shortOrderId(id: string): string {
  return id.slice(-6).toUpperCase()
}
