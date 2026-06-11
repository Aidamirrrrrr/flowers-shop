'use client'

import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CategoryChips } from '@/components/catalog/CategoryChips'
import { ProductCard } from '@/components/catalog/ProductCard'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { BRAND_NAME } from '@/constants/brand'
import { useCatalogContext } from '@/context/CatalogContext'
import { PageHeader } from '@/components/layout/PageHeader'

export function HomePage() {
  const { products, categories, loading, error } = useCatalogContext()
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let list = products
    if (category !== 'all') {
      list = list.filter((p) => p.categoryId === category)
    }
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter((p) => p.name.toLowerCase().includes(q))
    }
    return list
  }, [products, category, search])

  return (
    <div className="space-y-4">
      <PageHeader title={BRAND_NAME} largeLogo />

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          className="h-11 bg-background pl-9"
          placeholder="Поиск букетов..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Поиск букетов"
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-9 w-full rounded-full" />
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/5] w-full rounded-lg" />
            ))}
          </div>
        </div>
      ) : (
        <>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <CategoryChips
            categories={categories}
            selected={category}
            onChange={setCategory}
          />

          <div className="grid grid-cols-2 gap-3">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {!error && products.length === 0 && (
            <Alert>
              <AlertDescription>
                Каталог пуст. Запустите: <strong>pnpm db:setup</strong>
              </AlertDescription>
            </Alert>
          )}

          {!error && products.length > 0 && filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">Ничего не найдено</p>
          )}
        </>
      )}
    </div>
  )
}
