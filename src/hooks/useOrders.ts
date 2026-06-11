'use client'

import { useOrdersQuery } from '@/hooks/queries/use-orders-query'

export type { OrderSummary } from '@/hooks/queries/use-orders-query'

export function useOrders() {
  const query = useOrdersQuery()

  return {
    orders: query.data ?? [],
    loading: query.isPending,
    error: query.error instanceof Error ? query.error.message : null,
    refresh: query.refetch,
  }
}
