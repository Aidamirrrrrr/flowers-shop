import {
  useCallback,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import { getProductById } from '../data/products'
import { CartContext, type CartItem } from './cart-context'

type CartState = {
  items: CartItem[]
}

const STORAGE_KEY = 'flowers-shop-cart'

function loadCart(): CartState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return { items: [] }
    const parsed = JSON.parse(raw) as CartState
    if (!Array.isArray(parsed.items)) return { items: [] }
    return parsed
  } catch {
    return { items: [] }
  }
}

let cartState: CartState = loadCart()
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((l) => l())
}

function persist() {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cartState))
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return cartState
}

export function CartProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot)

  const total = useMemo(
    () =>
      state.items.reduce((sum, item) => {
        const product = getProductById(item.productId)
        return sum + (product?.price ?? 0) * item.quantity
      }, 0),
    [state.items],
  )

  const itemCount = useMemo(
    () => state.items.reduce((sum, item) => sum + item.quantity, 0),
    [state.items],
  )

  const addItem = useCallback((productId: string, qty = 1) => {
    const existing = cartState.items.find((i) => i.productId === productId)
    if (existing) {
      cartState = {
        items: cartState.items.map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + qty }
            : i,
        ),
      }
    } else {
      cartState = {
        items: [...cartState.items, { productId, quantity: qty }],
      }
    }
    persist()
    emit()
  }, [])

  const removeItem = useCallback((productId: string) => {
    cartState = {
      items: cartState.items.filter((i) => i.productId !== productId),
    }
    persist()
    emit()
  }, [])

  const updateQty = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      cartState = {
        items: cartState.items.filter((i) => i.productId !== productId),
      }
    } else {
      cartState = {
        items: cartState.items.map((i) =>
          i.productId === productId ? { ...i, quantity } : i,
        ),
      }
    }
    persist()
    emit()
  }, [])

  const clearCart = useCallback(() => {
    cartState = { items: [] }
    persist()
    emit()
  }, [])

  const getQty = useCallback(
    (productId: string) =>
      state.items.find((i) => i.productId === productId)?.quantity ?? 0,
    [state.items],
  )

  const value = useMemo(
    () => ({
      items: state.items,
      itemCount,
      total,
      addItem,
      removeItem,
      updateQty,
      clearCart,
      getQty,
    }),
    [state.items, itemCount, total, addItem, removeItem, updateQty, clearCart, getQty],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
