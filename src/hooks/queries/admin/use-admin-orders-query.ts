'use client'

import { useQuery } from '@tanstack/react-query'
import { apiJson } from '@/lib/query/fetch'
import { queryKeys } from '@/lib/query/keys'
import type { AdminOrder } from '@/types/admin'

const ORDERS_POLL_MS = 15_000

async function fetchAdminOrders() {
  const data = await apiJson<{ orders: AdminOrder[] }>('/api/admin/orders')
  return data.orders
}

export function useAdminOrdersQuery() {
  return useQuery({
    queryKey: queryKeys.admin.orders,
    queryFn: fetchAdminOrders,
    staleTime: 10_000,
    refetchInterval: ORDERS_POLL_MS,
    refetchIntervalInBackground: false,
  })
}
