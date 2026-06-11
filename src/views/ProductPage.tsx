'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { Check, Droplets, Minus, Plus, ShoppingCart, Truck } from 'lucide-react'
import { useCatalogContext } from '@/context/CatalogContext'
import { useCart } from '@/hooks/useCart'
import { Price } from '@/components/ui/Price'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@/components/ui/Icon'
import { PostcardField } from '@/components/cart/PostcardField'
import { cn } from '@/lib/utils'

export function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { getProduct, loading: catalogLoading } = useCatalogContext()
  const product = id ? getProduct(id) : undefined
  const { addItem, updateQty, getQty, ready } = useCart()
  const [justAdded, setJustAdded] = useState(false)
  const [showPostcard, setShowPostcard] = useState(false)

  if (catalogLoading && !product) {
    return (
      <div className="space-y-4">
        <Skeleton className="aspect-square w-[calc(100%+32px)] -mx-4" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-12 w-full" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertDescription>Товар не найден или скрыт</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => router.push('/')}>
          На главную
        </Button>
      </div>
    )
  }

  const qty = getQty(product.id)

  const handleAdd = () => {
    addItem(product.id)
    setJustAdded(true)
    setShowPostcard(true)
    window.setTimeout(() => setJustAdded(false), 600)
  }

  return (
    <>
      <img
        src={product.image}
        alt={product.name}
        className="animate-hero-reveal -mx-4 mb-4 aspect-square w-[calc(100%+32px)] bg-muted object-cover"
      />
      <h1 className="animate-fade-in-up-delayed mb-2 text-[1.35rem] font-medium tracking-wide">
        {product.name}
      </h1>
      <div className="animate-fade-in-up-delayed-2">
        <Price value={product.price} large />
      </div>

      <div className="animate-fade-in-up-delayed-3 my-4 mb-5">
        {qty === 0 ? (
          <Button
            className={cn('w-full', justAdded && 'animate-btn-pulse')}
            disabled={!ready}
            haptic="medium"
            onClick={handleAdd}
          >
            {justAdded ? <Icon icon={Check} size={20} /> : <Icon icon={ShoppingCart} size={20} />}
            {!ready ? 'Загрузка…' : justAdded ? 'Добавлено' : 'В корзину'}
          </Button>
        ) : (
          <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-secondary px-3 py-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              haptic="selection"
              aria-label="Уменьшить"
              onClick={() => updateQty(product.id, qty - 1)}
            >
              <Icon icon={Minus} size={18} />
            </Button>
            <span className="flex-1 text-center text-sm font-semibold">В корзине · {qty} шт.</span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              haptic="selection"
              aria-label="Увеличить"
              onClick={() => updateQty(product.id, qty + 1)}
            >
              <Icon icon={Plus} size={18} />
            </Button>
          </div>
        )}
      </div>

      <p className="animate-fade-in-up-delayed-4 mb-5 text-[0.95rem] text-muted-foreground">
        {product.description}
      </p>

      <Card className="mb-3 gap-0 py-0 shadow-none">
        <CardContent className="p-4">
          <div className="mb-2 flex items-center gap-2">
            <Icon icon={Droplets} size={18} />
            <h3 className="m-0 text-[0.95rem] font-medium">Уход за букетом</h3>
          </div>
          <p className="m-0 text-sm text-muted-foreground">{product.careTips}</p>
        </CardContent>
      </Card>

      <Link
        href="/about#delivery"
        className="mb-4 inline-flex items-center gap-1.5 font-medium hover:opacity-80"
      >
        <Icon icon={Truck} size={16} />
        О доставке и оплате
      </Link>

      {(qty > 0 || showPostcard) && (
        <PostcardField key={product.id} productId={product.id} requireInCart={false} />
      )}
    </>
  )
}
