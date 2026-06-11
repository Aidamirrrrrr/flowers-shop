export const queryKeys = {
  products: ['products'] as const,
  categories: ['categories'] as const,
  orders: ['orders'] as const,
  session: ['session'] as const,
  cartSuggestions: ['cart-suggestions'] as const,
  admin: {
    orders: ['admin', 'orders'] as const,
    products: ['admin', 'products'] as const,
    product: (id: string) => ['admin', 'products', id] as const,
    categories: ['admin', 'categories'] as const,
    category: (id: string) => ['admin', 'categories', id] as const,
    users: ['admin', 'users'] as const,
  },
} as const
