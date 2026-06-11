'use client'

import { useEffect, useMemo, useState } from 'react'
import type { CatalogProduct } from '@/types/catalog'
import { useCart } from '@/hooks/useCart'
import { SuggestionCard } from './SuggestionCard'
import { Skeleton } from '@/components/ui/skeleton'

export function CartSuggestions() {
  const { items } = useCart()
  const [suggestions, setSuggestions] = useState<CatalogProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/cart-suggestions')
      .then((res) => res.json())
      .then((data: { products: CatalogProduct[] }) => setSuggestions(data.products ?? []))
      .catch(() => setSuggestions([]))
      .finally(() => setLoading(false))
  }, [])

  const visible = useMemo(() => {
    const inCart = new Set(items.map((i) => i.productId))
    return suggestions.filter((p) => !inCart.has(p.id))
  }, [items, suggestions])

  if (loading) {
    return <Skeleton className="h-32 w-full" />
  }

  if (visible.length === 0) {
    return null
  }

  return (
    <section className="mt-7" aria-labelledby="cart-suggestions-title">
      <h2 id="cart-suggestions-title" className="mb-3 text-[0.95rem] font-semibold tracking-wide">
        Вам может пригодиться
      </h2>
      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {visible.map((product) => (
          <SuggestionCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
