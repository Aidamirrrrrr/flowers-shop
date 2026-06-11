export const ORDER_STATUS_LABELS = {
  NEW: 'Новый',
  CONFIRMED: 'Подтверждён',
  DELIVERING: 'Доставляется',
  DELIVERED: 'Доставлен',
  CANCELLED: 'Отменён',
} as const

export type OrderStatusKey = keyof typeof ORDER_STATUS_LABELS

export function orderStatusLabel(status: OrderStatusKey): string {
  return ORDER_STATUS_LABELS[status]
}
