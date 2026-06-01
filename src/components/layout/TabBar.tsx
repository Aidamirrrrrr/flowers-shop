'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Info, ShoppingCart, User } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { Icon } from '@/components/ui/Icon'

const tabs = [
  { href: '/', label: 'Главная', icon: Home, exact: true },
  { href: '/cart', label: 'Корзина', icon: ShoppingCart, exact: false },
  { href: '/about', label: 'О нас', icon: Info, exact: false },
  { href: '/profile', label: 'Профиль', icon: User, exact: false },
] as const

export function TabBar() {
  const pathname = usePathname()
  const { itemCount } = useCart()

  return (
    <nav className="tab-bar" aria-label="Основная навигация">
      {tabs.map(({ href, label, icon: TabIcon, exact }) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={`tab-bar__item${isActive ? ' tab-bar__item--active' : ''}`}
          >
            <span className="tab-bar__icon-wrap">
              <Icon icon={TabIcon} size={20} />
            </span>
            {label}
            {href === '/cart' && itemCount > 0 && (
              <span className="tab-bar__badge" aria-label={`${itemCount} в корзине`}>
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
