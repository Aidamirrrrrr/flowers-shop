'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useCatalogContext } from './CatalogContext'
import { CartContext, type CartItem } from './cart-context'

const STORAGE_KEY = 'flowers-shop-cart'

function loadCartItems(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as { items?: CartItem[] }
    return Array.isArray(parsed.items) ? parsed.items : []
  } catch {
    return []
  }
}

function saveCartItems(items: CartItem[]) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ items }))
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { getProduct } = useCatalogContext()
  const [items, setItems] = useState<CartItem[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setItems(loadCartItems())
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    saveCartItems(items)
  }, [items, ready])

  const total = useMemo(
    () =>
      items.reduce((sum, item) => {
        const product = getProduct(item.productId)
        return sum + (product?.price ?? 0) * item.quantity
      }, 0),
    [items, getProduct],
  )

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  )

  const addItem = useCallback((productId: string, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId)
      if (existing) {
        return prev.map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + qty }
            : i,
        )
      }
      return [...prev, { productId, quantity: qty }]
    })
  }, [])

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId))
  }, [])

  const updateQty = useCallback((productId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((i) => i.productId !== productId)
      }
      return prev.map((i) =>
        i.productId === productId ? { ...i, quantity } : i,
      )
    })
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const getQty = useCallback(
    (productId: string) =>
      items.find((i) => i.productId === productId)?.quantity ?? 0,
    [items],
  )

  const getPostcardText = useCallback(
    (productId: string) =>
      items.find((i) => i.productId === productId)?.postcardText ?? '',
    [items],
  )

  const setPostcardText = useCallback((productId: string, text: string) => {
    const trimmed = text.trim()
    setItems((prev) => {
      if (!prev.some((i) => i.productId === productId)) return prev
      return prev.map((i) =>
        i.productId === productId
          ? { ...i, postcardText: trimmed || undefined }
          : i,
      )
    })
  }, [])

  const value = useMemo(
    () => ({
      items,
      itemCount,
      total,
      addItem,
      removeItem,
      updateQty,
      clearCart,
      getQty,
      getPostcardText,
      setPostcardText,
      ready,
    }),
    [
      items,
      itemCount,
      total,
      addItem,
      removeItem,
      updateQty,
      clearCart,
      getQty,
      getPostcardText,
      setPostcardText,
      ready,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
