'use client'

import { useSession } from '@/context/SessionContext'
import type { AdminUser } from '@/types/admin'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'

type AdminUsersTabProps = {
  users: AdminUser[]
  loading: boolean
  onRoleChange: (userId: string, role: 'ADMIN' | 'USER') => void
  updatingUserId?: string | null
}

export function AdminUsersTab({
  users,
  loading,
  onRoleChange,
  updatingUserId,
}: AdminUsersTabProps) {
  const { user: me } = useSession()

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Пользователей пока нет — они появятся после входа в мини-приложение
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Назначайте администраторов среди пользователей, которые уже заходили в магазин.
      </p>
      {users.map((user) => {
        const isSelf = user.id === me?.id
        const isAdmin = user.role === 'ADMIN'
        const busy = updatingUserId === user.id

        return (
          <Card key={user.id}>
            <CardContent className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium leading-snug">
                    {user.displayName}
                    {isSelf && (
                      <span className="ml-1.5 text-xs font-normal text-muted-foreground">(вы)</span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user.username ? `@${user.username}` : `TG ${user.telegramId}`}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {user.orderCount} заказ(ов) · с {user.createdAtLabel}
                  </p>
                </div>
                {isAdmin && <Badge>Админ</Badge>}
              </div>
              <div className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5">
                <Label
                  htmlFor={`admin-${user.id}`}
                  className="cursor-pointer text-sm font-normal"
                >
                  Права администратора
                </Label>
                <Switch
                  id={`admin-${user.id}`}
                  checked={isAdmin}
                  disabled={busy || (isSelf && isAdmin)}
                  onCheckedChange={(checked) =>
                    onRoleChange(user.id, checked ? 'ADMIN' : 'USER')
                  }
                />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
