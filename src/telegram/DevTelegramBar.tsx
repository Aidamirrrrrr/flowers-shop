'use client'

import { useEffect, useState } from 'react'
import { getMockWebApp, isDevMockActive } from './mockWebApp'
import { cn } from '@/lib/utils'

export function DevTelegramBar() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!isDevMockActive()) return
    const refresh = () => setTick((n) => n + 1)
    window.addEventListener('tg-mock-update', refresh)
    return () => window.removeEventListener('tg-mock-update', refresh)
  }, [])

  if (!isDevMockActive()) return null

  const webApp = getMockWebApp()
  if (!webApp) return null

  void tick

  const { BackButton, MainButton } = webApp

  return (
    <>
      {BackButton.isVisible && (
        <button
          type="button"
          className={cn(
            'fixed z-[200] max-w-[calc(var(--app-max-width)-32px)] cursor-pointer rounded-lg border-0 px-3.5 py-2 text-sm font-semibold text-white shadow-md',
            'left-4 top-[calc(8px+env(safe-area-inset-top,0px))] bg-neutral-800/90',
            'min-[481px]:left-1/2 min-[481px]:-translate-x-[calc(50%+175px)]',
          )}
          aria-label="Назад (mock Telegram)"
          onClick={() => BackButton.click()}
        >
          ← Назад
        </button>
      )}
      {MainButton.isVisible && (
        <button
          type="button"
          className={cn(
            'fixed bottom-[calc(8px+env(safe-area-inset-bottom,0px))] left-1/2 z-[200] w-[min(calc(var(--app-max-width)-32px),calc(100vw-32px))] -translate-x-1/2',
            'cursor-pointer rounded-[10px] border-0 bg-primary px-5 py-3.5 text-base font-semibold text-primary-foreground shadow-lg',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
          disabled={!MainButton.isActive}
          onClick={() => MainButton.click()}
        >
          {MainButton.text}
        </button>
      )}
      <div
        className={cn(
          'pointer-events-none fixed top-[calc(8px+env(safe-area-inset-top,0px))] z-[200] rounded-md bg-primary px-2 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-primary-foreground',
          'right-4 min-[481px]:right-[max(8px,calc(50%-215px))]',
        )}
        title="Telegram SDK замокан для dev"
      >
        TG mock
      </div>
    </>
  )
}
