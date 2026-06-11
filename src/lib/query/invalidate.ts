import type { QueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query/keys'

export async function invalidateCatalog(queryClient: QueryClient) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.products }),
    queryClient.invalidateQueries({ queryKey: queryKeys.categories }),
    queryClient.invalidateQueries({ queryKey: queryKeys.cartSuggestions }),
  ])
}

export async function invalidateAdminProducts(queryClient: QueryClient) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.admin.products }),
    invalidateCatalog(queryClient),
  ])
}

export async function invalidateAdminCategories(queryClient: QueryClient) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.admin.categories }),
    invalidateCatalog(queryClient),
  ])
}

export async function invalidateOrders(queryClient: QueryClient) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.orders }),
    queryClient.invalidateQueries({ queryKey: queryKeys.admin.orders }),
  ])
}
