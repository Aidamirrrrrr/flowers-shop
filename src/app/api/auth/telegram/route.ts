import { NextResponse } from 'next/server'
import { COOKIE_NAME, createSessionToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { resolveTelegramUser } from '@/lib/telegram-auth'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { initData?: string }
    const telegramUser = resolveTelegramUser(body.initData ?? '')

    if (!telegramUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.upsert({
      where: { telegramId: BigInt(telegramUser.id) },
      create: {
        telegramId: BigInt(telegramUser.id),
        username: telegramUser.username ?? null,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name ?? null,
      },
      update: {
        username: telegramUser.username ?? null,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name ?? null,
      },
    })

    const token = await createSessionToken({ userId: user.id, role: user.role })
    const response = NextResponse.json({ ok: true, userId: user.id })
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    })
    return response
  } catch (error) {
    console.error('[auth/telegram]', error)
    return NextResponse.json({ error: 'Auth failed' }, { status: 500 })
  }
}
