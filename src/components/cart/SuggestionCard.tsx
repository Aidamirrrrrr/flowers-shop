'use client'

import type { MouseEvent } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import type { Product } from '../../data/products'
import { useCart } from '../../hooks/useCart'
import { Price } from '../ui/Price'
import { Icon } from '../ui/Icon'
import { hapticImpact } from '../../telegram/haptic'

type SuggestionCardProps = {
  product: Product
}

export function SuggestionCard({ product }: SuggestionCardProps) {
  const { addItem, getQty } = useCart()
  const qty = getQty(product.id)

  const handleAdd = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product.id)
    hapticImpact('light')
  }

  return (
    <article className="suggestion-card">
      <Link href={`/product/${product.id}`} className="suggestion-card__link">
        <img
          src={product.image}
          alt={product.name}
          className="suggestion-card__image"
          loading="lazy"
        />
        <div className="suggestion-card__body">
          <h3 className="suggestion-card__name">{product.name}</h3>
          <Price value={product.price} />
        </div>
      </Link>
      <button
        type="button"
        className="suggestion-card__add"
        aria-label={qty > 0 ? `В корзине: ${qty}` : 'Добавить в корзину'}
        onClick={handleAdd}
      >
        {qty > 0 ? <span className="suggestion-card__qty">{qty}</span> : <Icon icon={Plus} size={18} />}
      </button>
    </article>
  )
}
