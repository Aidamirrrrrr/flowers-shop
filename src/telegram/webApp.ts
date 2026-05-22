import type { MockWebApp } from './mockWebApp'

type TelegramWindow = Window & {
  Telegram?: { WebApp: MockWebApp }
}

function getTelegramWindow(): TelegramWindow {
  return window as TelegramWindow
}

/** Always reads the current WebApp instance (mock in dev or real in Telegram). */
export function getWebApp(): MockWebApp {
  const app = getTelegramWindow().Telegram?.WebApp
  if (!app || typeof app.ready !== 'function') {
    throw new Error(
      'Telegram WebApp is unavailable. Ensure initDevMock runs before the app in dev.',
    )
  }
  return app
}
