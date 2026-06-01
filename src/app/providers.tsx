'use client'

import '@/telegram/initDevMock'
import { CartProvider } from '@/context/CartContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>
}
