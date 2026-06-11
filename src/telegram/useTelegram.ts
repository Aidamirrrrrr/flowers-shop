'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { TELEGRAM_CHANNEL_URL } from '@/constants/brand'
import { applyTelegramTheme } from './applyTheme'
import { hapticImpact } from './haptic'
import { getWebApp } from './webApp'

const STACK_PREFIXES = ['/product/', '/cart/checkout', '/admin/products/', '/admin/categories/']

function isStackRoute(pathname: string) {
  return STACK_PREFIXES.some((prefix) => pathname.startsWith(prefix))
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
  const pathname = usePathname()
  const router = useRouter()
  const show = isStackRoute(pathname)

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
      router.back()
    }
    WebApp.BackButton.onClick(handler)
    return () => {
      WebApp.BackButton.offClick(handler)
    }
  }, [router])
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
  if (typeof window === 'undefined') return null
  try {
    return getWebApp().initDataUnsafe.user ?? null
  } catch {
    return null
  }
}

export {
  hapticImpact,
  hapticNotification,
  hapticSelection,
} from './haptic'

export function showDemoAlert(message: string) {
  if (typeof window === 'undefined') return
  getWebApp().showAlert(message)
}

export function openSupport() {
  if (typeof window === 'undefined') return
  getWebApp().openTelegramLink('https://t.me/support')
}

export function openChannel() {
  if (typeof window === 'undefined') return
  getWebApp().openTelegramLink(TELEGRAM_CHANNEL_URL)
}

export { isDevMockActive } from './mockWebApp'
