'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/format-price'
import { useSession } from '@/context/SessionContext'
import {
  ORDER_STATUS_LABELS,
  orderStatusLabel,
  type OrderStatusKey,
} from '@/lib/order-status-labels'

type AdminOrder = {
  id: string
  shortId: string
  status: OrderStatusKey
  statusLabel: string
  customerName: string
  phone: string
  address: string
  deliveryAtLabel: string
  createdAtLabel: string
  total: number
  items: { name: string; quantity: number; price: number; postcardText: string | null }[]
}

type AdminProduct = {
  id: string
  name: string
  price: number
  category: string
  active: boolean
}

const STATUS_OPTIONS = Object.keys(ORDER_STATUS_LABELS) as OrderStatusKey[]

export function AdminPage() {
  const router = useRouter()
  const { user, loading: sessionLoading } = useSession()
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [ordersRes, productsRes] = await Promise.all([
        fetch('/api/admin/orders', { credentials: 'include' }),
        fetch('/api/admin/products', { credentials: 'include' }),
      ])
      if (!ordersRes.ok || !productsRes.ok) {
        throw new Error('Нет доступа к админке')
      }
      const ordersData = (await ordersRes.json()) as { orders: AdminOrder[] }
      const productsData = (await productsRes.json()) as { products: AdminProduct[] }
      setOrders(ordersData.orders)
      setProducts(productsData.products)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user?.isAdmin) void loadData()
  }, [user?.isAdmin, loadData])

  const updateOrderStatus = async (orderId: string, status: OrderStatusKey) => {
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status }),
    })
    if (!res.ok) return
    const data = (await res.json()) as {
      order: { id: string; status: OrderStatusKey; statusLabel: string }
    }
    setOrders((prev) =>
      prev.map((o) =>
        o.id === data.order.id
          ? { ...o, status: data.order.status, statusLabel: data.order.statusLabel }
          : o,
      ),
    )
  }

  const toggleProduct = async (productId: string, active: boolean) => {
    const res = await fetch(`/api/admin/products/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ active }),
    })
    if (!res.ok) return
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, active } : p)),
    )
  }

  if (sessionLoading) {
    return <Skeleton className="h-10 w-full" />
  }

  if (!user?.isAdmin) {
    return (
      <div className="space-y-4">
        <PageHeader title="Админ" />
        <Alert>
          <AlertDescription>Доступ только для администратора. Войдите через Telegram или dev-режим.</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => router.push('/profile')}>
          В профиль
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Админ-панель" />

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="orders">Заказы ({orders.length})</TabsTrigger>
          <TabsTrigger value="products">Товары ({products.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-4 space-y-3">
          {loading ? (
            <Skeleton className="h-40 w-full rounded-lg" />
          ) : orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">Заказов пока нет</p>
          ) : (
            orders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">№{order.shortId}</CardTitle>
                    <span className="text-xs text-muted-foreground">{order.createdAtLabel}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>{order.customerName} · {order.phone}</p>
                  <p className="text-muted-foreground">{order.address}</p>
                  <p>Доставка: {order.deliveryAtLabel} · <strong>{formatPrice(order.total)}</strong></p>
                  <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        {item.name} × {item.quantity}
                        {item.postcardText ? ` · «${item.postcardText}»` : ''}
                      </li>
                    ))}
                  </ul>
                  <Select
                    value={order.status}
                    onValueChange={(value) =>
                      void updateOrderStatus(order.id, value as OrderStatusKey)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {orderStatusLabel(s)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="products" className="mt-4 space-y-3">
          {loading ? (
            <Skeleton className="h-40 w-full rounded-lg" />
          ) : (
            products.map((product) => (
              <Card key={product.id}>
                <CardContent className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.category} · {formatPrice(product.price)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge variant={product.active ? 'default' : 'secondary'}>
                      {product.active ? 'В каталоге' : 'Скрыт'}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => void toggleProduct(product.id, !product.active)}
                    >
                      {product.active ? 'Скрыть' : 'Показать'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
