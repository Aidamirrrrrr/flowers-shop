'use client'

import { useCallback, useEffect, useState } from 'react'
import { AdminOrdersTab } from '@/components/admin/AdminOrdersTab'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { AdminOrder } from '@/types/admin'
import type { OrderStatusKey } from '@/lib/order-status-labels'

const ORDERS_POLL_MS = 15_000

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadOrders = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true)
    try {
      const res = await fetch('/api/admin/orders', { credentials: 'include' })
      if (!res.ok) throw new Error('Нет доступа к заказам')
      const data = (await res.json()) as { orders: AdminOrder[] }
      setOrders(data.orders)
      setError(null)
    } catch (err) {
      if (!silent) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки заказов')
      }
    } finally {
      if (!silent) setRefreshing(false)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadOrders(true)
    const id = window.setInterval(() => void loadOrders(true), ORDERS_POLL_MS)
    return () => window.clearInterval(id)
  }, [loadOrders])

  const updateOrderStatus = async (orderId: string, status: OrderStatusKey) => {
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status }),
    })
    if (!res.ok) return
    const data = (await res.json()) as {
      order: { id: string; status: OrderStatusKey; statusLabel: string }
    }
    setOrders((prev) =>
      prev.map((o) =>
        o.id === data.order.id
          ? { ...o, status: data.order.status, statusLabel: data.order.statusLabel }
          : o,
      ),
    )
  }

  return (
    <div className="mt-4 space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <AdminOrdersTab
        orders={orders}
        loading={loading}
        refreshing={refreshing}
        onRefresh={() => void loadOrders()}
        onStatusChange={(id, status) => void updateOrderStatus(id, status)}
      />
    </div>
  )
}
