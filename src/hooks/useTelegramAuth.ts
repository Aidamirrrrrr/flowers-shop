'use client'

import { useEffect } from 'react'
import { getWebApp } from '@/telegram/webApp'

export function useTelegramAuth() {
  useEffect(() => {
    const initData = getWebApp().initData ?? ''
    fetch('/api/auth/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData }),
      credentials: 'include',
    }).catch((err) => {
      console.error('[useTelegramAuth]', err)
    })
  }, [])
}
