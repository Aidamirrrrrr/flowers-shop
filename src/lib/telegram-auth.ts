import { validateInitData, parseTelegramUser, type TelegramUser } from '@/lib/telegram'

const DEV_MOCK_USER: TelegramUser = {
  id: 100001,
  first_name: 'Анна',
  last_name: 'Демо',
  username: 'demo_flowers',
}

export function resolveTelegramUser(initData: string): TelegramUser | null {
  const trimmed = initData.trim()

  if (trimmed) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    if (!botToken) {
      console.error('TELEGRAM_BOT_TOKEN is not set')
      return null
    }
    if (!validateInitData(trimmed, botToken)) return null
    return parseTelegramUser(trimmed)
  }

  if (process.env.NODE_ENV === 'development') {
    return DEV_MOCK_USER
  }

  return null
}
