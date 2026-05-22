import { createContext } from 'react'

export type CartItem = {
  productId: string
  quantity: number
}

export type CartContextValue = {
  items: CartItem[]
  itemCount: number
  total: number
  addItem: (productId: string, qty?: number) => void
  removeItem: (productId: string) => void
  updateQty: (productId: string, quantity: number) => void
  clearCart: () => void
  getQty: (productId: string) => number
}

export const CartContext = createContext<CartContextValue | null>(null)
