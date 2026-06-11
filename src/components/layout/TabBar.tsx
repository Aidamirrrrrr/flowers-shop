'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Info, ShoppingCart, Shield, User } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useSession } from '@/context/SessionContext'
import { cn } from '@/lib/utils'

const baseTabs = [
  { href: '/', label: 'Главная', icon: Home, exact: true },
  { href: '/cart', label: 'Корзина', icon: ShoppingCart, exact: false },
  { href: '/about', label: 'О нас', icon: Info, exact: false },
  { href: '/profile', label: 'Профиль', icon: User, exact: false },
] as const

export function TabBar() {
  const pathname = usePathname()
  const { itemCount } = useCart()
  const { user } = useSession()

  const tabs = user?.isAdmin
    ? [
        baseTabs[0],
        baseTabs[1],
        { href: '/admin', label: 'Админ', icon: Shield, exact: false },
        baseTabs[2],
        baseTabs[3],
      ]
    : [...baseTabs]

  return (
    <nav
      className="fixed bottom-0 left-1/2 z-50 flex h-[calc(var(--tab-bar-height)+env(safe-area-inset-bottom,0px))] w-full max-w-[var(--app-max-width)] -translate-x-1/2 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur supports-[backdrop-filter]:bg-background/80"
      aria-label="Основная навигация"
    >
      {tabs.map(({ href, label, icon: TabIcon, exact }) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'relative flex h-full flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors',
              isActive ? 'text-foreground' : 'text-muted-foreground',
            )}
          >
            <TabIcon className="h-[22px] w-[22px]" strokeWidth={isActive ? 2.25 : 1.75} />
            <span>{label}</span>
            {href === '/cart' && itemCount > 0 && (
              <span className="absolute right-[calc(50%-22px)] top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
