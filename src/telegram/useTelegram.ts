import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { applyTelegramTheme } from './applyTheme'
import { hapticImpact } from './haptic'
import { getWebApp } from './webApp'

const STACK_ROUTES = ['/product/', '/cart/checkout']

function isStackRoute(pathname: string) {
  return STACK_ROUTES.some((r) =>
    r.endsWith('/') ? pathname.startsWith(r) : pathname === r || pathname.startsWith(r),
  )
}

export function useTelegramInit() {
  useEffect(() => {
    const WebApp = getWebApp()
    WebApp.ready()
    WebApp.expand()
    applyTelegramTheme()
  }, [])
}

export function useTelegramBackButton() {
  const location = useLocation()
  const navigate = useNavigate()
  const show = isStackRoute(location.pathname)

  useEffect(() => {
    const WebApp = getWebApp()
    if (show) {
      WebApp.BackButton.show()
    } else {
      WebApp.BackButton.hide()
    }
  }, [show])

  useEffect(() => {
    const WebApp = getWebApp()
    const handler = () => {
      hapticImpact('light')
      navigate(-1)
    }
    WebApp.BackButton.onClick(handler)
    return () => {
      WebApp.BackButton.offClick(handler)
    }
  }, [navigate])
}

export function useTelegramMainButton(options: {
  visible: boolean
  text: string
  onClick: () => void
  disabled?: boolean
}) {
  const { visible, text, onClick, disabled } = options

  useEffect(() => {
    const WebApp = getWebApp()
    if (visible) {
      WebApp.MainButton.setText(text)
      WebApp.MainButton.show()
    } else {
      WebApp.MainButton.hide()
    }
    return () => {
      WebApp.MainButton.hide()
    }
  }, [visible, text])

  useEffect(() => {
    const WebApp = getWebApp()
    if (visible) {
      if (disabled) WebApp.MainButton.disable()
      else WebApp.MainButton.enable()
    }
  }, [visible, disabled])

  useEffect(() => {
    if (!visible) return
    const WebApp = getWebApp()
    WebApp.MainButton.onClick(onClick)
    return () => {
      WebApp.MainButton.offClick(onClick)
    }
  }, [visible, onClick])
}

export function useTelegramUser() {
  return getWebApp().initDataUnsafe.user ?? null
}

export {
  hapticImpact,
  hapticNotification,
  hapticSelection,
} from './haptic'

export function showDemoAlert(message: string) {
  getWebApp().showAlert(message)
}

export function openSupport() {
  getWebApp().openTelegramLink('https://t.me/support')
}

export { isDevMockActive } from './mockWebApp'
