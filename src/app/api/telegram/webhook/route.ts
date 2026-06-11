import { NextResponse } from 'next/server'
import { getWebhookSecret, sendStartMessage } from '@/lib/telegram-bot'
import { isStartCommand, type TelegramUpdate } from '@/lib/telegram-updates'

export async function POST(request: Request) {
  const secret = getWebhookSecret()
  if (secret) {
    const header = request.headers.get('x-telegram-bot-api-secret-token')
    if (header !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  let update: TelegramUpdate
  try {
    update = (await request.json()) as TelegramUpdate
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const message = update.message
  if (message && isStartCommand(message.text)) {
    try {
      const result = await sendStartMessage(message.chat.id)
      if (!result.ok) {
        console.error('[telegram/webhook] sendStartMessage failed:', result.description)
      }
    } catch (error) {
      console.error('[telegram/webhook]', error)
    }
  }

  return NextResponse.json({ ok: true })
}
