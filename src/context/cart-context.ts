import { createContext } from 'react'

export type CartItem = {
  productId: string
  quantity: number
  postcardText?: string
}

export type CartContextValue = {
  items: CartItem[]
  itemCount: number
  total: number
  ready: boolean
  addItem: (productId: string, qty?: number) => void
  removeItem: (productId: string) => void
  updateQty: (productId: string, quantity: number) => void
  clearCart: () => void
  getQty: (productId: string) => number
  getPostcardText: (productId: string) => string
  setPostcardText: (productId: string, text: string) => void
}

export const CartContext = createContext<CartContextValue | null>(null)
