'use client'

import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { useSession } from '@/context/SessionContext'

export function AdminGate({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { user, loading } = useSession()

  if (loading) {
    return <Skeleton className="h-10 w-full" />
  }

  if (!user?.isAdmin) {
    return (
      <div className="space-y-4">
        <PageHeader title="Админ" />
        <Alert>
          <AlertDescription>
            Доступ только для администратора. Войдите через Telegram или dev-режим.
          </AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => router.push('/profile')}>
          В профиль
        </Button>
      </div>
    )
  }

  return children
}
