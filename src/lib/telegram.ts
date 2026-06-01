import { createHmac } from 'crypto'

export type TelegramUser = {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
}

export function validateInitData(initData: string, botToken: string): boolean {
  const params = new URLSearchParams(initData)
  const hash = params.get('hash')
  if (!hash) return false

  params.delete('hash')
  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')

  const secretKey = createHmac('sha256', 'WebAppData').update(botToken).digest()
  const calculatedHash = createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex')

  return calculatedHash === hash
}

export function parseTelegramUser(initData: string): TelegramUser | null {
  const params = new URLSearchParams(initData)
  const userRaw = params.get('user')
  if (!userRaw) return null
  try {
    return JSON.parse(userRaw) as TelegramUser
  } catch {
    return null
  }
}
