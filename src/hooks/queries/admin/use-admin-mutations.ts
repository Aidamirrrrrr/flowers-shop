'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiJson } from '@/lib/query/fetch'
import {
  invalidateAdminCategories,
  invalidateAdminProducts,
  invalidateOrders,
} from '@/lib/query/invalidate'
import { queryKeys } from '@/lib/query/keys'
import type { AdminProduct, AdminCategory, AdminUser } from '@/types/admin'
import type { OrderStatusKey } from '@/lib/order-status-labels'

export function useToggleProductMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ productId, active }: { productId: string; active: boolean }) => {
      const data = await apiJson<{ product: AdminProduct }>(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active }),
      })
      return data.product
    },
    onSuccess: () => void invalidateAdminProducts(queryClient),
  })
}

export function useDeleteProductMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (productId: string) => {
      await apiJson(`/api/admin/products/${productId}`, { method: 'DELETE' })
      return productId
    },
    onSuccess: () => void invalidateAdminProducts(queryClient),
  })
}

export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (categoryId: string) => {
      await apiJson(`/api/admin/categories/${categoryId}`, { method: 'DELETE' })
      return categoryId
    },
    onSuccess: () => void invalidateAdminCategories(queryClient),
  })
}

export function useUpdateOrderStatusMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatusKey }) => {
      const data = await apiJson<{
        order: { id: string; status: OrderStatusKey; statusLabel: string }
      }>(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      return data.order
    },
    onSuccess: () => void invalidateOrders(queryClient),
  })
}

export function useSaveProductMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      mode,
      productId,
      payload,
    }: {
      mode: 'create' | 'edit'
      productId?: string
      payload: Record<string, unknown>
    }) => {
      const url = mode === 'create' ? '/api/admin/products' : `/api/admin/products/${productId}`
      await apiJson(url, {
        method: mode === 'create' ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    },
    onSuccess: () => void invalidateAdminProducts(queryClient),
  })
}

export function useUpdateUserRoleMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: 'ADMIN' | 'USER' }) => {
      const data = await apiJson<{ user: AdminUser }>(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      })
      return data.user
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.users })
      void queryClient.invalidateQueries({ queryKey: queryKeys.session })
    },
  })
}

export function useSaveCategoryMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      mode,
      categoryId,
      payload,
    }: {
      mode: 'create' | 'edit'
      categoryId?: string
      payload: Record<string, unknown>
    }) => {
      const url = mode === 'create' ? '/api/admin/categories' : `/api/admin/categories/${categoryId}`
      await apiJson<{ category?: AdminCategory }>(url, {
        method: mode === 'create' ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    },
    onSuccess: () => void invalidateAdminCategories(queryClient),
  })
}
