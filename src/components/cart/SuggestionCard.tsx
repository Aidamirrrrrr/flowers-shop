'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import type { CatalogProduct } from '@/types/catalog'
import { useCart } from '@/hooks/useCart'
import { Price } from '@/components/ui/Price'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Icon } from '@/components/ui/Icon'

type SuggestionCardProps = {
  product: CatalogProduct
}

export function SuggestionCard({ product }: SuggestionCardProps) {
  const { addItem } = useCart()

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product.id)
  }

  return (
    <Link href={`/product/${product.id}`} className="block w-[148px] shrink-0 snap-start">
      <Card className="gap-0 overflow-hidden py-0 shadow-none">
        <img
          src={product.image}
          alt={product.name}
          className="aspect-square w-full bg-muted object-cover"
          loading="lazy"
        />
        <div className="p-2">
          <p className="mb-1 line-clamp-2 text-xs font-semibold leading-tight">{product.name}</p>
          <div className="flex items-center justify-between gap-2">
            <Price value={product.price} />
            <Button type="button" size="icon" className="h-8 w-8" onClick={handleAdd}>
              <Icon icon={Plus} size={16} />
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  )
}
