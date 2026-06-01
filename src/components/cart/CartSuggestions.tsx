'use client'

import { useMemo } from 'react'
import { getCartSuggestionProducts } from '../../data/cartSuggestions'
import { useCart } from '../../hooks/useCart'
import { SuggestionCard } from './SuggestionCard'

export function CartSuggestions() {
  const { items } = useCart()

  const suggestions = useMemo(() => {
    const inCart = new Set(items.map((i) => i.productId))
    return getCartSuggestionProducts().filter((p) => !inCart.has(p.id))
  }, [items])

  if (suggestions.length === 0) {
    return null
  }

  return (
    <section className="cart-suggestions" aria-labelledby="cart-suggestions-title">
      <h2 id="cart-suggestions-title" className="cart-suggestions__title">
        Вам может пригодиться
      </h2>
      <div className="cart-suggestions__track">
        {suggestions.map((product) => (
          <SuggestionCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
