'use client'

import { usePathname } from 'next/navigation'
import { DevTelegramBar } from '@/telegram/DevTelegramBar'
import { useTelegramBackButton, useTelegramInit } from '@/telegram/useTelegram'
import { TabBar } from './TabBar'

const HIDE_TAB_PREFIXES = ['/product/', '/cart/checkout']

function shouldHideTabBar(pathname: string) {
  return HIDE_TAB_PREFIXES.some((p) => pathname.startsWith(p))
}

export function ShopShell({ children }: { children: React.ReactNode }) {
  useTelegramInit()
  useTelegramBackButton()

  const pathname = usePathname()
  const hideTab = shouldHideTabBar(pathname)
  const isCheckout = pathname === '/cart/checkout'

  const mainClass = [
    'app-main',
    hideTab ? 'app-main--no-tab' : '',
    isCheckout ? 'app-main--checkout' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="app-shell">
      <DevTelegramBar />
      <main className={mainClass}>
        <div key={pathname} className="page-enter">
          {children}
        </div>
      </main>
      {!hideTab && <TabBar />}
    </div>
  )
}
