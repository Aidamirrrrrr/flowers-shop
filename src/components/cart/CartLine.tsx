'use client'

import { Minus, Plus, Trash2 } from 'lucide-react'
import { hapticImpact, hapticSelection } from '@/telegram/haptic'
import { useCatalogContext } from '@/context/CatalogContext'
import { useCart } from '@/hooks/useCart'
import type { CartItem } from '@/context/cart-context'
import { Price } from '@/components/ui/Price'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

type CartLineProps = {
  item: CartItem
}

export function CartLine({ item }: CartLineProps) {
  const { updateQty, removeItem } = useCart()
  const { getProduct } = useCatalogContext()
  const product = getProduct(item.productId)

  if (!product) return null

  return (
    <Card>
      <CardContent className="flex gap-3 p-3">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug">{product.name}</h3>
          <div className="mt-1">
            <Price value={product.price * item.quantity} />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              aria-label="Уменьшить"
              onClick={() => {
                hapticSelection()
                updateQty(item.productId, item.quantity - 1)
              }}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="min-w-6 text-center text-sm font-medium">{item.quantity}</span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-8 w-8"
              aria-label="Увеличить"
              onClick={() => {
                hapticSelection()
                updateQty(item.productId, item.quantity + 1)
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="ml-auto h-8 w-8 text-muted-foreground"
              onClick={() => {
                hapticImpact('light')
                removeItem(item.productId)
              }}
              aria-label="Удалить"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          {item.postcardText && (
            <p className="mt-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Открытка:</span> {item.postcardText}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
