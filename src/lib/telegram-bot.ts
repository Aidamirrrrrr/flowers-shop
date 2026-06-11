import { BRAND_NAME, TELEGRAM_CHANNEL_URL } from '@/constants/brand'

const TELEGRAM_API = 'https://api.telegram.org'

type TelegramApiResponse<T = unknown> = {
  ok: boolean
  result?: T
  description?: string
}

export function getBotToken(): string | null {
  return process.env.TELEGRAM_BOT_TOKEN?.trim() || null
}

export function getAppUrl(): string | null {
  const fromEnv =
    process.env.TELEGRAM_WEBAPP_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.APP_URL?.trim()

  if (fromEnv) return fromEnv.replace(/\/$/, '')

  const railway = process.env.RAILWAY_PUBLIC_DOMAIN?.trim()
  if (railway) return `https://${railway}`

  return null
}

export function getWebhookSecret(): string | null {
  return process.env.TELEGRAM_WEBHOOK_SECRET?.trim() || null
}

export async function callTelegramApi<T = unknown>(
  method: string,
  body?: Record<string, unknown>,
): Promise<TelegramApiResponse<T>> {
  const token = getBotToken()
  if (!token) {
    return { ok: false, description: 'TELEGRAM_BOT_TOKEN is not set' }
  }

  const res = await fetch(`${TELEGRAM_API}/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })

  return (await res.json()) as TelegramApiResponse<T>
}

export async function sendStartMessage(chatId: number) {
  const webAppUrl = getAppUrl()
  if (!webAppUrl) {
    console.error('[telegram-bot] TELEGRAM_WEBAPP_URL / APP_URL is not set')
    return callTelegramApi('sendMessage', {
      chat_id: chatId,
      text: `${BRAND_NAME}\n\nМагазин временно недоступен — не задан URL приложения.`,
    })
  }

  return callTelegramApi('sendMessage', {
    chat_id: chatId,
    text: `Добро пожаловать в ${BRAND_NAME}!\n\nНажмите кнопку ниже, чтобы открыть каталог и оформить заказ.`,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Открыть магазин',
            web_app: { url: webAppUrl },
          },
        ],
        [
          {
            text: 'Канал ELEMENT Concept',
            url: TELEGRAM_CHANNEL_URL,
          },
        ],
      ],
    },
  })
}

export async function setTelegramWebhook(webhookUrl: string) {
  const secret = getWebhookSecret()
  return callTelegramApi('setWebhook', {
    url: webhookUrl,
    allowed_updates: ['message'],
    drop_pending_updates: true,
    ...(secret ? { secret_token: secret } : {}),
  })
}
