'use client'

import { useState } from 'react'
import { AdminOrdersTab } from '@/components/admin/AdminOrdersTab'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ApiError } from '@/lib/query/fetch'
import { useAdminOrdersQuery } from '@/hooks/queries/admin/use-admin-orders-query'
import {
  useDeleteOrderMutation,
  useUpdateOrderDeliveryMutation,
  useUpdateOrderStatusMutation,
} from '@/hooks/queries/admin/use-admin-mutations'

export function AdminOrdersPage() {
  const { data: orders = [], isPending: loading, isFetching, error, refetch } =
    useAdminOrdersQuery()
  const updateStatus = useUpdateOrderStatusMutation()
  const updateDelivery = useUpdateOrderDeliveryMutation()
  const deleteOrder = useDeleteOrderMutation()
  const [actionError, setActionError] = useState<string | null>(null)

  const errorMessage = error instanceof Error ? error.message : null

  const deleteOrderHandler = async (orderId: string): Promise<string | null> => {
    try {
      await deleteOrder.mutateAsync(orderId)
      return null
    } catch (err) {
      return err instanceof ApiError ? err.message : 'Не удалось удалить заказ'
    }
  }

  return (
    <div className="mt-4 space-y-4">
      {(errorMessage || actionError) && (
        <Alert variant="destructive">
          <AlertDescription>{actionError ?? errorMessage}</AlertDescription>
        </Alert>
      )}
      <AdminOrdersTab
        orders={orders}
        loading={loading}
        refreshing={isFetching && !loading}
        onRefresh={() => void refetch()}
        onStatusChange={(id, status) => updateStatus.mutate({ orderId: id, status })}
        onDeliveryChange={(id, deliveryAt) => {
          setActionError(null)
          updateDelivery.mutate(
            { orderId: id, deliveryAt },
            {
              onError: (err) => {
                setActionError(
                  err instanceof ApiError ? err.message : 'Не удалось обновить дату доставки',
                )
              },
            },
          )
        }}
        updatingDeliveryId={updateDelivery.isPending ? updateDelivery.variables?.orderId : null}
        onDelete={deleteOrderHandler}
      />
    </div>
  )
}
