'use client'

import { Minus, Plus, Trash2 } from 'lucide-react'
import { hapticImpact, hapticSelection } from '../../telegram/haptic'
import { getProductById } from '../../data/products'
import { useCart } from '../../hooks/useCart'
import type { CartItem } from '../../context/cart-context'
import { Price } from '../ui/Price'
import { Icon } from '../ui/Icon'

type CartLineProps = {
  item: CartItem
}

export function CartLine({ item }: CartLineProps) {
  const { updateQty, removeItem } = useCart()
  const product = getProductById(item.productId)

  if (!product) return null

  return (
    <div className="cart-line">
      <img
        src={product.image}
        alt={product.name}
        className="cart-line__image"
        loading="lazy"
      />
      <div className="cart-line__info">
        <h3 className="cart-line__name">{product.name}</h3>
        <Price value={product.price * item.quantity} />
        <div className="cart-line__qty">
          <button
            type="button"
            className="qty-btn"
            aria-label="Уменьшить количество"
            onClick={() => {
              hapticSelection()
              updateQty(item.productId, item.quantity - 1)
            }}
          >
            <Icon icon={Minus} size={16} />
          </button>
          <span>{item.quantity}</span>
          <button
            type="button"
            className="qty-btn"
            aria-label="Увеличить количество"
            onClick={() => {
              hapticSelection()
              updateQty(item.productId, item.quantity + 1)
            }}
          >
            <Icon icon={Plus} size={16} />
          </button>
          <button
            type="button"
            className="link-inline cart-line__remove"
            onClick={() => {
              hapticImpact('light')
              removeItem(item.productId)
            }}
            aria-label="Удалить"
          >
            <Icon icon={Trash2} size={16} />
          </button>
        </div>
        {item.postcardText && (
          <p className="cart-line__postcard">
            <span className="cart-line__postcard-label">Открытка:</span>{' '}
            {item.postcardText}
          </p>
        )}
      </div>
    </div>
  )
}
