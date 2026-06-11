'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const TABS = [
  { href: '/admin/orders', label: 'Заказы', segment: 'orders' },
  { href: '/admin/products', label: 'Товары', segment: 'products' },
  { href: '/admin/categories', label: 'Категории', segment: 'categories' },
] as const

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav
      className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1"
      aria-label="Разделы админки"
    >
      {TABS.map(({ href, label, segment }) => {
        const active =
          pathname === href ||
          (pathname.startsWith(`${href}/`) &&
            !pathname.endsWith('/new') &&
            !pathname.includes('/edit'))
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'rounded-md px-2 py-3.5 text-center text-sm font-medium transition-colors',
              active
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
