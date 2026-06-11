'use client'

import { AdminCategoriesTab } from '@/components/admin/AdminCategoriesTab'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ApiError } from '@/lib/query/fetch'
import { useAdminCategoriesQuery } from '@/hooks/queries/admin/use-admin-categories-query'
import { useDeleteCategoryMutation } from '@/hooks/queries/admin/use-admin-mutations'

export function AdminCategoriesPage() {
  const { data: categories = [], isPending: loading, error } = useAdminCategoriesQuery()
  const deleteCategoryMutation = useDeleteCategoryMutation()

  const errorMessage = error instanceof Error ? error.message : null

  const deleteCategory = async (categoryId: string): Promise<string | null> => {
    try {
      await deleteCategoryMutation.mutateAsync(categoryId)
      return null
    } catch (err) {
      if (err instanceof ApiError) return err.message
      return 'Не удалось удалить категорию'
    }
  }

  return (
    <div className="mt-4 space-y-4">
      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      <AdminCategoriesTab
        categories={categories}
        loading={loading}
        onDelete={deleteCategory}
      />
    </div>
  )
}
