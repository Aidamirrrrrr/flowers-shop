'use client'

import Link from 'next/link'
import type { CatalogProduct } from '@/types/catalog'
import { Card } from '@/components/ui/card'
import { Price } from '@/components/ui/Price'
import { onHapticPointerDown } from '@/telegram/bind-haptic'

type ProductCardProps = {
  product: CatalogProduct
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/product/${product.id}`}
      onPointerDown={onHapticPointerDown('light')}
      className="group block h-full active:scale-[0.98] motion-safe:transition-transform motion-safe:duration-200"
    >
      <Card className="flex h-full flex-col gap-0 overflow-hidden border-border py-0 shadow-none transition-colors group-hover:border-foreground/25">
        <div className="aspect-square shrink-0 overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
        </div>
        <div className="flex flex-1 flex-col justify-between gap-1 p-3">
          <h3 className="line-clamp-2 min-h-10 text-sm font-medium leading-snug">{product.name}</h3>
          <Price value={product.price} />
        </div>
      </Card>
    </Link>
  )
}
