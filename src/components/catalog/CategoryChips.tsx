import { CATEGORIES, type ProductCategory } from '../../data/products'
import { hapticSelection } from '../../telegram/haptic'

type CategoryChipsProps = {
  selected: ProductCategory
  onChange: (category: ProductCategory) => void
}

export function CategoryChips({ selected, onChange }: CategoryChipsProps) {
  return (
    <div className="category-chips" role="tablist" aria-label="Категории">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          type="button"
          role="tab"
          aria-selected={selected === cat.id}
          className={`chip${selected === cat.id ? ' chip--active' : ''}`}
          onClick={() => {
            hapticSelection()
            onChange(cat.id)
          }}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
