import { ShoppingBag, Truck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { formatPrice } from '../data/products'
import { CartLine } from '../components/cart/CartLine'
import { PageHeader } from '../components/layout/PageHeader'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'
import { Icon } from '../components/ui/Icon'
import { hapticImpact } from '../telegram/haptic'

export function CartPage() {
  const { items, total, itemCount } = useCart()
  const navigate = useNavigate()

  const goCheckout = () => {
    hapticImpact('light')
    navigate('/cart/checkout')
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
            <Button variant="primary" onClick={() => navigate('/')}>
              В каталог
            </Button>
          }
        />
        <p className="cart-empty-link">
          <Link to="/about">
            <Icon icon={Truck} size={14} />
            О доставке и сервисе
          </Link>
        </p>
      </>
    )
  }

  return (
    <>
      <PageHeader title="Корзина" />
      {items.map((item) => (
        <CartLine key={item.productId} item={item} />
      ))}
      <p className="cart-empty-link">
        <Link to="/about">
          <Icon icon={Truck} size={14} />
          Доставка от 2 часов · Оплата при получении
        </Link>
      </p>

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
    </>
  )
}
