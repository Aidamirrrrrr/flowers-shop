'use client'

import { useSession } from '@/context/SessionContext'
import { useOrdersQuery } from '@/hooks/queries/use-orders-query'

export type { OrderSummary } from '@/hooks/queries/use-orders-query'

export function useOrders() {
  const { user, loading: sessionLoading } = useSession()
  const query = useOrdersQuery(Boolean(user) && !sessionLoading)

  return {
    orders: query.data ?? [],
    loading: sessionLoading || query.isPending,
    error: query.error instanceof Error ? query.error.message : null,
    refresh: query.refetch,
  }
}
