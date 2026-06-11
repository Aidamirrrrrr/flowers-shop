'use client'

import type { CatalogCategory } from '@/types/catalog'
import { Button } from '@/components/ui/button'
import { hapticSelection } from '@/telegram/haptic'
import { cn } from '@/lib/utils'

type CategoryChipsProps = {
  categories: CatalogCategory[]
  selected: string
  onChange: (categoryId: string) => void
}

export function CategoryChips({ categories, selected, onChange }: CategoryChipsProps) {
  return (
    <div
      className="mb-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="tablist"
      aria-label="Категории"
    >
      {categories.map((cat) => {
        const active = selected === cat.id
        return (
          <Button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={active}
            variant={active ? 'default' : 'outline'}
            size="sm"
            className={cn('shrink-0 rounded-full px-4', !active && 'bg-background')}
            onClick={() => {
              hapticSelection()
              onChange(cat.id)
            }}
          >
            {cat.label}
          </Button>
        )
      })}
    </div>
  )
}
