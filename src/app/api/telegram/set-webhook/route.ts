import { NextResponse } from 'next/server'
import { getAppUrl, getWebhookSecret, setTelegramWebhook } from '@/lib/telegram-bot'

export async function POST(request: Request) {
  const secret = getWebhookSecret()
  if (!secret) {
    return NextResponse.json(
      { error: 'Set TELEGRAM_WEBHOOK_SECRET in env before calling this endpoint' },
      { status: 503 },
    )
  }

  const auth = request.headers.get('authorization')
  const bearer = auth?.startsWith('Bearer ') ? auth.slice(7) : null
  const querySecret = new URL(request.url).searchParams.get('secret')
  if (bearer !== secret && querySecret !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const appUrl = getAppUrl()
  if (!appUrl) {
    return NextResponse.json(
      { error: 'Set TELEGRAM_WEBAPP_URL or APP_URL (or deploy on Railway with public domain)' },
      { status: 503 },
    )
  }

  const webhookUrl = `${appUrl}/api/telegram/webhook`
  const result = await setTelegramWebhook(webhookUrl)

  if (!result.ok) {
    return NextResponse.json(
      { error: result.description ?? 'setWebhook failed', webhookUrl },
      { status: 502 },
    )
  }

  return NextResponse.json({ ok: true, webhookUrl })
}
