'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { onHapticPointerDown } from '@/telegram/bind-haptic'

const TABS = [
  { href: '/admin/orders', label: 'Заказы' },
  { href: '/admin/products', label: 'Товары' },
  { href: '/admin/categories', label: 'Категории' },
  { href: '/admin/users', label: 'Люди' },
] as const

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav
      className="grid grid-cols-4 gap-1 rounded-lg bg-muted p-1"
      aria-label="Разделы админки"
    >
      {TABS.map(({ href, label }) => {
        const active =
          pathname === href ||
          (pathname.startsWith(`${href}/`) &&
            !pathname.endsWith('/new') &&
            !pathname.includes('/edit'))
        return (
          <Link
            key={href}
            href={href}
            onPointerDown={onHapticPointerDown('selection')}
            className={cn(
              'rounded-md px-1 py-3.5 text-center text-xs font-medium transition-colors active:opacity-70 motion-safe:transition-opacity sm:px-2 sm:text-sm',
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
