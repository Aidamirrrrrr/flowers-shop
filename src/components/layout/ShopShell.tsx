'use client'

import { usePathname } from 'next/navigation'
import { DevTelegramBar } from '@/telegram/DevTelegramBar'
import { useTelegramBackButton, useTelegramInit } from '@/telegram/useTelegram'
import { TabBar } from './TabBar'
import { cn } from '@/lib/utils'

const HIDE_TAB_PREFIXES = ['/product/', '/cart/checkout']

function shouldHideTabBar(pathname: string) {
  if (HIDE_TAB_PREFIXES.some((p) => pathname.startsWith(p))) return true
  if (/^\/admin\/products\/.+/.test(pathname)) return true
  if (/^\/admin\/categories\/.+/.test(pathname)) return true
  return false
}

export function ShopShell({ children }: { children: React.ReactNode }) {
  useTelegramInit()
  useTelegramBackButton()

  const pathname = usePathname()
  const hideTab = shouldHideTabBar(pathname)

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[var(--app-max-width)] flex-col bg-background">
      <DevTelegramBar />
      <main
        className={cn(
          'flex-1 px-4 pt-3',
          hideTab
            ? 'pb-[calc(env(safe-area-inset-bottom,0px)+16px)]'
            : 'pb-[calc(var(--tab-bar-height)+env(safe-area-inset-bottom,0px)+16px)]',
        )}
      >
        <div key={pathname} className="animate-fade-in-up">
          {children}
        </div>
      </main>
      {!hideTab && <TabBar />}
    </div>
  )
}
