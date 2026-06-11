'use client'

import { useQuery } from '@tanstack/react-query'
import { apiJson } from '@/lib/query/fetch'
import { queryKeys } from '@/lib/query/keys'

export type SessionUser = {
  id: string
  role: string
  isAdmin: boolean
  displayName: string
  username: string | null
}

export async function fetchSession() {
  try {
    const data = await apiJson<{ user: SessionUser }>('/api/me')
    return data.user
  } catch {
    return null
  }
}

export function useSessionQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.session,
    queryFn: fetchSession,
    enabled,
    staleTime: 5 * 60_000,
    retry: false,
  })
}
