'use client'

import { useState } from 'react'
import { AdminUsersTab } from '@/components/admin/AdminUsersTab'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ApiError } from '@/lib/query/fetch'
import { useAdminUsersQuery } from '@/hooks/queries/admin/use-admin-users-query'
import { useUpdateUserRoleMutation } from '@/hooks/queries/admin/use-admin-mutations'

export function AdminUsersPage() {
  const { data: users = [], isPending: loading, error } = useAdminUsersQuery()
  const updateRole = useUpdateUserRoleMutation()
  const [actionError, setActionError] = useState<string | null>(null)

  const errorMessage = error instanceof Error ? error.message : null

  const handleRoleChange = (userId: string, role: 'ADMIN' | 'USER') => {
    setActionError(null)
    updateRole.mutate(
      { userId, role },
      {
        onError: (err) => {
          setActionError(err instanceof ApiError ? err.message : 'Не удалось обновить роль')
        },
      },
    )
  }

  return (
    <div className="mt-4 space-y-4">
      {(errorMessage || actionError) && (
        <Alert variant="destructive">
          <AlertDescription>{actionError ?? errorMessage}</AlertDescription>
        </Alert>
      )}
      <AdminUsersTab
        users={users}
        loading={loading}
        updatingUserId={updateRole.isPending ? updateRole.variables?.userId : null}
        onRoleChange={handleRoleChange}
      />
    </div>
  )
}
