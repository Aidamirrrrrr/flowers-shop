'use client'

import { MessageCircle } from 'lucide-react'
import { useTelegramUser, openSupport } from '@/telegram/useTelegram'
import { useSession } from '@/context/SessionContext'
import { useOrders } from '@/hooks/useOrders'
import { formatPrice } from '@/lib/format-price'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { MenuRow } from '@/components/ui/menu-row'

export function ProfilePage() {
  const tgUser = useTelegramUser()
  const { user: me } = useSession()
  const { orders, loading, error } = useOrders()

  const displayName = tgUser
    ? [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' ')
    : me?.displayName ?? 'Гость'
  const username = tgUser?.username ? `@${tgUser.username}` : me?.username ? `@${me.username}` : ''

  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="space-y-6">
      <PageHeader title="Профиль" />

      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted text-lg font-medium">
            {tgUser?.photo_url ? (
              <img src={tgUser.photo_url} alt="" className="h-full w-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold">{displayName}</h2>
            {username && <p className="truncate text-sm text-muted-foreground">{username}</p>}
            {me?.isAdmin && (
              <Badge variant="secondary" className="mt-2">
                Администратор
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden py-0">
        <MenuRow icon={MessageCircle} label="Написать в поддержку" onClick={openSupport} />
      </Card>

      <section className="space-y-3">
        <h2 className="text-base font-semibold">История заказов</h2>
        {loading && (
          <div className="space-y-2">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        )}
        {error && !loading && (
          <p className="text-sm text-muted-foreground">{error}</p>
        )}
        {!loading && !error && orders.length === 0 && (
          <p className="text-sm text-muted-foreground">Заказов пока нет</p>
        )}
        <div className="space-y-3">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="space-y-2 p-4">
                <p className="font-medium leading-snug">{order.title}</p>
                <p className="text-sm text-muted-foreground">
                  №{order.shortId} · {order.date}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline">{order.status}</Badge>
                  <span className="text-sm font-medium">
                    {formatPrice(order.total)}
                    {order.itemCount > 1 ? ` · ${order.itemCount} шт.` : ''}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
