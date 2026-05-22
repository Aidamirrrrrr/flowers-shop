import { Outlet, useLocation } from 'react-router-dom'
import { DevTelegramBar } from '../../telegram/DevTelegramBar'
import { useTelegramBackButton, useTelegramInit } from '../../telegram/useTelegram'
import { TabBar } from './TabBar'

const HIDE_TAB_PATHS = ['/product/', '/cart/checkout', '/about']

function shouldHideTabBar(pathname: string) {
  return HIDE_TAB_PATHS.some((p) =>
    p.endsWith('/') ? pathname.startsWith(p) : pathname === p,
  )
}

export function AppShell() {
  useTelegramInit()
  useTelegramBackButton()

  const location = useLocation()
  const hideTab = shouldHideTabBar(location.pathname)
  const isCheckout = location.pathname === '/cart/checkout'

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
        <div key={location.pathname} className="page-enter">
          <Outlet />
        </div>
      </main>
      {!hideTab && <TabBar />}
    </div>
  )
}
