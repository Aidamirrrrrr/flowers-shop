'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  fetchSession,
  useSessionQuery,
  type SessionUser,
} from '@/hooks/queries/use-session-query'
import { queryKeys } from '@/lib/query/keys'
import { getWebApp } from '@/telegram/webApp'

export type { SessionUser }

type SessionContextValue = {
  user: SessionUser | null
  loading: boolean
  refresh: () => Promise<void>
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [bootstrapping, setBootstrapping] = useState(true)
  const sessionQuery = useSessionQuery(!bootstrapping)

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.session })
  }, [queryClient])

  useEffect(() => {
    async function bootstrap() {
      try {
        const existing = await fetchSession()
        if (existing) {
          queryClient.setQueryData(queryKeys.session, existing)
          return
        }

        const initData = getWebApp().initData ?? ''
        if (!initData) return

        const response = await fetch('/api/auth/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ initData }),
          credentials: 'include',
        })

        if (response.ok) {
          const data = (await response.json()) as { user?: SessionUser }
          if (data.user) {
            queryClient.setQueryData(queryKeys.session, data.user)
            return
          }
        }

        await queryClient.fetchQuery({
          queryKey: queryKeys.session,
          queryFn: fetchSession,
        })
      } finally {
        setBootstrapping(false)
      }
    }
    void bootstrap()
  }, [queryClient])

  const loading = bootstrapping || sessionQuery.isPending

  return (
    <SessionContext.Provider
      value={{
        user: sessionQuery.data ?? null,
        loading,
        refresh,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used within SessionProvider')
  return ctx
}
