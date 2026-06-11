'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/layout/PageHeader'
import { AdminOrdersTab } from '@/components/admin/AdminOrdersTab'
import { AdminProductsTab } from '@/components/admin/AdminProductsTab'
import { AdminCategoriesTab } from '@/components/admin/AdminCategoriesTab'
import { ProductFormDialog } from '@/components/admin/ProductFormDialog'
import { CategoryFormDialog } from '@/components/admin/CategoryFormDialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { useCatalogContext } from '@/context/CatalogContext'
import { useSession } from '@/context/SessionContext'
import type { AdminCategory, AdminOrder, AdminProduct } from '@/types/admin'
import type { OrderStatusKey } from '@/lib/order-status-labels'

const ORDERS_POLL_MS = 15_000

export function AdminPage() {
  const router = useRouter()
  const { user, loading: sessionLoading } = useSession()
  const { refresh: refreshCatalog } = useCatalogContext()
  const [tab, setTab] = useState('orders')
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [productDialog, setProductDialog] = useState<{
    open: boolean
    mode: 'create' | 'edit'
    productId?: string
  }>({ open: false, mode: 'create' })
  const [categoryDialog, setCategoryDialog] = useState<{
    open: boolean
    mode: 'create' | 'edit'
    categoryId?: string
  }>({ open: false, mode: 'create' })

  const newOrdersCount = orders.filter((o) => o.status === 'NEW').length

  const loadOrders = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true)
    try {
      const res = await fetch('/api/admin/orders', { credentials: 'include' })
      if (!res.ok) throw new Error('Нет доступа к заказам')
      const data = (await res.json()) as { orders: AdminOrder[] }
      setOrders(data.orders)
    } catch (err) {
      if (!silent) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки заказов')
      }
    } finally {
      if (!silent) setRefreshing(false)
    }
  }, [])

  const loadProducts = useCallback(async () => {
    const res = await fetch('/api/admin/products', { credentials: 'include' })
    if (!res.ok) throw new Error('Нет доступа к товарам')
    const data = (await res.json()) as { products: AdminProduct[] }
    setProducts(data.products)
  }, [])

  const loadCategories = useCallback(async () => {
    const res = await fetch('/api/admin/categories', { credentials: 'include' })
    if (!res.ok) throw new Error('Нет доступа к категориям')
    const data = (await res.json()) as { categories: AdminCategory[] }
    setCategories(data.categories)
  }, [])

  const loadAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await Promise.all([loadOrders(true), loadProducts(), loadCategories()])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки')
    } finally {
      setLoading(false)
    }
  }, [loadOrders, loadProducts, loadCategories])

  useEffect(() => {
    if (user?.isAdmin) void loadAll()
  }, [user?.isAdmin, loadAll])

  useEffect(() => {
    if (!user?.isAdmin || tab !== 'orders') return
    const id = window.setInterval(() => void loadOrders(true), ORDERS_POLL_MS)
    return () => window.clearInterval(id)
  }, [user?.isAdmin, tab, loadOrders])

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
    const data = (await res.json()) as { product: AdminProduct }
    setProducts((prev) => prev.map((p) => (p.id === productId ? data.product : p)))
    void refreshCatalog()
  }

  const deleteProduct = async (productId: string): Promise<string | null> => {
    const res = await fetch(`/api/admin/products/${productId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    const data = (await res.json()) as { error?: string }
    if (!res.ok) return data.error ?? 'Не удалось удалить товар'
    setProducts((prev) => prev.filter((p) => p.id !== productId))
    void refreshCatalog()
    return null
  }

  const deleteCategory = async (categoryId: string): Promise<string | null> => {
    const res = await fetch(`/api/admin/categories/${categoryId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    const data = (await res.json()) as { error?: string }
    if (!res.ok) return data.error ?? 'Не удалось удалить категорию'
    setCategories((prev) => prev.filter((c) => c.id !== categoryId))
    void refreshCatalog()
    return null
  }

  const handleProductSaved = (product: AdminProduct) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id)
      if (exists) return prev.map((p) => (p.id === product.id ? product : p))
      return [...prev, product].sort((a, b) => a.name.localeCompare(b.name, 'ru'))
    })
    void refreshCatalog()
  }

  const handleCategorySaved = (category: AdminCategory) => {
    setCategories((prev) => {
      const exists = prev.some((c) => c.id === category.id)
      const next = exists
        ? prev.map((c) => (c.id === category.id ? category : c))
        : [...prev, category]
      return next.sort((a, b) => a.sort - b.sort || a.label.localeCompare(b.label, 'ru'))
    })
    void refreshCatalog()
  }

  if (sessionLoading) {
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

  return (
    <div className="space-y-4">
      <PageHeader title="Админ-панель" />

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid h-auto w-full grid-cols-3 p-1">
          <TabsTrigger value="orders" className="gap-1 py-2.5 text-xs sm:text-sm">
            Заказы
            {orders.length > 0 && (
              <Badge
                variant={newOrdersCount > 0 ? 'default' : 'secondary'}
                className="h-5 min-w-5 px-1 text-[10px]"
              >
                {newOrdersCount > 0 ? newOrdersCount : orders.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="products" className="gap-1 py-2.5 text-xs sm:text-sm">
            Товары
            {products.length > 0 && (
              <Badge variant="secondary" className="h-5 min-w-5 px-1 text-[10px]">
                {products.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-1 py-2.5 text-xs sm:text-sm">
            Категории
            {categories.length > 0 && (
              <Badge variant="secondary" className="h-5 min-w-5 px-1 text-[10px]">
                {categories.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-4">
          <AdminOrdersTab
            orders={orders}
            loading={loading}
            refreshing={refreshing}
            onRefresh={() => void loadOrders()}
            onStatusChange={(id, status) => void updateOrderStatus(id, status)}
          />
        </TabsContent>

        <TabsContent value="products" className="mt-4">
          <AdminProductsTab
            products={products}
            loading={loading}
            onCreate={() => setProductDialog({ open: true, mode: 'create' })}
            onEdit={(productId) => setProductDialog({ open: true, mode: 'edit', productId })}
            onToggleActive={(id, active) => void toggleProduct(id, active)}
            onDelete={deleteProduct}
          />
        </TabsContent>

        <TabsContent value="categories" className="mt-4">
          <AdminCategoriesTab
            categories={categories}
            loading={loading}
            onCreate={() => setCategoryDialog({ open: true, mode: 'create' })}
            onEdit={(categoryId) => setCategoryDialog({ open: true, mode: 'edit', categoryId })}
            onDelete={deleteCategory}
          />
        </TabsContent>
      </Tabs>

      <ProductFormDialog
        open={productDialog.open}
        mode={productDialog.mode}
        productId={productDialog.productId}
        categories={categories}
        onOpenChange={(open) => setProductDialog((prev) => ({ ...prev, open }))}
        onSaved={handleProductSaved}
      />

      <CategoryFormDialog
        open={categoryDialog.open}
        mode={categoryDialog.mode}
        categoryId={categoryDialog.categoryId}
        categories={categories}
        onOpenChange={(open) => setCategoryDialog((prev) => ({ ...prev, open }))}
        onSaved={handleCategorySaved}
      />
    </div>
  )
}
