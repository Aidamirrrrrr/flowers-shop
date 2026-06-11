'use client'

import { AdminOrdersTab } from '@/components/admin/AdminOrdersTab'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAdminOrdersQuery } from '@/hooks/queries/admin/use-admin-orders-query'
import { useUpdateOrderStatusMutation } from '@/hooks/queries/admin/use-admin-mutations'

export function AdminOrdersPage() {
  const { data: orders = [], isPending: loading, isFetching, error, refetch } =
    useAdminOrdersQuery()
  const updateStatus = useUpdateOrderStatusMutation()

  const errorMessage = error instanceof Error ? error.message : null

  return (
    <div className="mt-4 space-y-4">
      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      <AdminOrdersTab
        orders={orders}
        loading={loading}
        refreshing={isFetching && !loading}
        onRefresh={() => void refetch()}
        onStatusChange={(id, status) => updateStatus.mutate({ orderId: id, status })}
      />
    </div>
  )
}
