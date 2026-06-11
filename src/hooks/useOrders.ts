'use client'

import { useCallback, useEffect, useState } from 'react'

export type OrderSummary = {
  id: string
  shortId: string
  title: string
  date: string
  status: string
  total: number
  itemCount: number
}

export function useOrders() {
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/orders', { credentials: 'include' })
      if (!res.ok) {
        throw new Error(res.status === 401 ? 'Войдите через Telegram' : 'Ошибка загрузки')
      }
      const data = (await res.json()) as { orders: OrderSummary[] }
      setOrders(data.orders)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { orders, loading, error, refresh }
}
