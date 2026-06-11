'use client'

import { useSession, type SessionUser } from '@/context/SessionContext'

export type MeUser = SessionUser

/** @deprecated Use useSession() */
export function useMe() {
  const { user, loading, refresh } = useSession()
  return { user, loading, refresh }
}
