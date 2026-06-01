'use client'

import { ShoppingBag, Truck } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '../hooks/useCart'
import { formatPrice } from '../data/products'
import { CartLine } from '../components/cart/CartLine'
import { CartSuggestions } from '../components/cart/CartSuggestions'
import { PageHeader } from '../components/layout/PageHeader'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'
import { Icon } from '../components/ui/Icon'
import { hapticImpact } from '../telegram/haptic'

export function CartPage() {
  const { items, total, itemCount } = useCart()
  const router = useRouter()

  const goCheckout = () => {
    hapticImpact('light')
    router.push('/cart/checkout')
  }

  if (items.length === 0) {
    return (
      <>
        <PageHeader title="Корзина" />
        <EmptyState
          icon={ShoppingBag}
          title="Корзина пуста"
          description="Добавьте букет из каталога — он порадует близких"
          action={
            <Button variant="primary" onClick={() => router.push('/')}>
              В каталог
            </Button>
          }
        />
        <CartSuggestions />
        <p className="cart-empty-link">
          <Link href="/about">
            <Icon icon={Truck} size={14} />
            О доставке и сервисе
          </Link>
        </p>
      </>
    )
  }

  return (
    <div className="cart-page">
      <PageHeader title="Корзина" />
      {items.map((item) => (
        <CartLine key={item.productId} item={item} />
      ))}
      <p className="cart-empty-link cart-empty-link--in-cart">
        <Link href="/about">
          <Icon icon={Truck} size={14} />
          Доставка от 2 часов · Оплата при получении
        </Link>
      </p>

      <CartSuggestions />

      <div className="cart-page__spacer" aria-hidden />

      <div className="cart-footer">
        <div className="cart-footer__row">
          <span>
            {itemCount} {itemCount === 1 ? 'товар' : itemCount < 5 ? 'товара' : 'товаров'}
          </span>
          <strong>{formatPrice(total)}</strong>
        </div>
        <Button variant="primary" block onClick={goCheckout}>
          Оформить заказ
        </Button>
      </div>
    </div>
  )
}
