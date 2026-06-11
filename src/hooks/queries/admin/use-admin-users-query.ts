'use client'

import { useQuery } from '@tanstack/react-query'
import { apiJson } from '@/lib/query/fetch'
import { queryKeys } from '@/lib/query/keys'
import type { AdminUser } from '@/types/admin'

async function fetchAdminUsers() {
  const data = await apiJson<{ users: AdminUser[] }>('/api/admin/users')
  return data.users
}

export function useAdminUsersQuery() {
  return useQuery({
    queryKey: queryKeys.admin.users,
    queryFn: fetchAdminUsers,
    staleTime: 30_000,
  })
}
