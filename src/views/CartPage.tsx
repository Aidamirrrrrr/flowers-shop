'use client'

import { ShoppingBag, Truck } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/lib/format-price'
import { CartLine } from '@/components/cart/CartLine'
import { CartSuggestions } from '@/components/cart/CartSuggestions'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function CartPage() {
  const { items, total, itemCount } = useCart()
  const router = useRouter()

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Корзина" />
        <EmptyState
          icon={ShoppingBag}
          title="Корзина пуста"
          description="Добавьте букет из каталога — он порадует близких"
          action={<Button onClick={() => router.push('/')}>В каталог</Button>}
        />
        <CartSuggestions />
        <Link href="/about" className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Truck className="h-4 w-4" />
          О доставке и сервисе
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4 pb-24">
      <PageHeader title="Корзина" />
      <div className="space-y-3">
        {items.map((item) => (
          <CartLine key={item.productId} item={item} />
        ))}
      </div>

      <Link href="/about" className="flex items-center gap-2 text-sm text-muted-foreground">
        <Truck className="h-4 w-4" />
        Доставка от 2 часов · Оплата при получении
      </Link>

      <CartSuggestions />

      <Card className="fixed bottom-[calc(56px+env(safe-area-inset-bottom,0px))] left-1/2 z-40 w-[calc(100%-32px)] max-w-[var(--app-max-width)] -translate-x-1/2 shadow-md">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {itemCount} {itemCount === 1 ? 'товар' : itemCount < 5 ? 'товара' : 'товаров'}
            </span>
            <strong className="text-base">{formatPrice(total)}</strong>
          </div>
          <Button className="w-full" onClick={() => router.push('/cart/checkout')}>
            Оформить заказ
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
