import { useEffect, useState } from 'react'
import { getMockWebApp, isDevMockActive } from './mockWebApp'
import './DevTelegramBar.css'

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
          className="dev-tg-back"
          aria-label="Назад (mock Telegram)"
          onClick={() => BackButton.click()}
        >
          ← Назад
        </button>
      )}
      {MainButton.isVisible && (
        <button
          type="button"
          className="dev-tg-main"
          disabled={!MainButton.isActive}
          onClick={() => MainButton.click()}
        >
          {MainButton.text}
        </button>
      )}
      <div className="dev-tg-badge" title="Telegram SDK замокан для dev">
        TG mock
      </div>
    </>
  )
}
