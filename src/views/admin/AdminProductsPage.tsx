'use client'

import { AdminProductsTab } from '@/components/admin/AdminProductsTab'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ApiError } from '@/lib/query/fetch'
import { useAdminProductsQuery } from '@/hooks/queries/admin/use-admin-products-query'
import {
  useDeleteProductMutation,
  useToggleProductMutation,
} from '@/hooks/queries/admin/use-admin-mutations'

export function AdminProductsPage() {
  const { data: products = [], isPending: loading, error } = useAdminProductsQuery()
  const toggleProduct = useToggleProductMutation()
  const deleteProductMutation = useDeleteProductMutation()

  const errorMessage = error instanceof Error ? error.message : null

  const deleteProduct = async (productId: string): Promise<string | null> => {
    try {
      await deleteProductMutation.mutateAsync(productId)
      return null
    } catch (err) {
      if (err instanceof ApiError) return err.message
      return 'Не удалось удалить товар'
    }
  }

  return (
    <div className="mt-4 space-y-4">
      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      <AdminProductsTab
        products={products}
        loading={loading}
        onToggleActive={(id, active) => toggleProduct.mutate({ productId: id, active })}
        onDelete={deleteProduct}
      />
    </div>
  )
}
