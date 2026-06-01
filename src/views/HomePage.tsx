'use client'

import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PRODUCTS, type ProductCategory } from '../data/products'
import { CategoryChips } from '../components/catalog/CategoryChips'
import { ProductCard } from '../components/catalog/ProductCard'
import { BRAND_NAME } from '../constants/brand'
import { PageHeader } from '../components/layout/PageHeader'
import { Icon } from '../components/ui/Icon'

export function HomePage() {
  const [category, setCategory] = useState<ProductCategory>('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let list = PRODUCTS
    if (category !== 'all') {
      list = list.filter((p) => p.category === category)
    }
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter((p) => p.name.toLowerCase().includes(q))
    }
    return list
  }, [category, search])

  return (
    <>
      <PageHeader title={BRAND_NAME} largeLogo />
      <div className="search-bar">
        <Icon icon={Search} size={18} />
        <input
          type="search"
          placeholder="Поиск букетов..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Поиск букетов"
        />
      </div>
      <CategoryChips selected={category} onChange={setCategory} />
      <div className="product-grid">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="empty-hint">Ничего не найдено</p>
      )}
    </>
  )
}
