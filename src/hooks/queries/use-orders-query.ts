'use client'

import { useQuery } from '@tanstack/react-query'
import { ApiError, apiJson } from '@/lib/query/fetch'
import { queryKeys } from '@/lib/query/keys'

export type OrderSummary = {
  id: string
  shortId: string
  title: string
  date: string
  status: string
  total: number
  itemCount: number
}

async function fetchOrders() {
  try {
    const data = await apiJson<{ orders: OrderSummary[] }>('/api/orders')
    return data.orders
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      throw new Error('Войдите через Telegram')
    }
    throw error
  }
}

export function useOrdersQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.orders,
    queryFn: fetchOrders,
    enabled,
    staleTime: 30_000,
  })
}
