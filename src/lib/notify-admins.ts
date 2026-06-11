import { BRAND_NAME } from '@/constants/brand'
import { formatOrderDateTime, shortOrderId } from '@/lib/order-labels'
import { prisma } from '@/lib/prisma'
import { callTelegramApi, getAppUrl } from '@/lib/telegram-bot'
import { formatPrice } from '@/lib/format-price'

type NewOrderPayload = {
  id: string
  customerName: string
  phone: string
  address: string
  deliveryAt: Date
  total: number
  items: { name: string; quantity: number }[]
}

export async function notifyAdminsNewOrder(order: NewOrderPayload) {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim()
  if (!token) {
    console.warn('[notify-admins] TELEGRAM_BOT_TOKEN is not set')
    return
  }

  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: { telegramId: true },
  })

  if (admins.length === 0) {
    console.warn('[notify-admins] no admins with telegramId in database')
    return
  }

  const shortId = shortOrderId(order.id)
  const itemsLines = order.items
    .map((item) => `• ${item.name} × ${item.quantity}`)
    .join('\n')

  const text = [
    `Новый заказ №${shortId}`,
    '',
    `Имя: ${order.customerName}`,
    `Телефон: ${order.phone}`,
    `Адрес: ${order.address}`,
    `Доставка: ${formatOrderDateTime(order.deliveryAt)}`,
    `Сумма: ${formatPrice(order.total)}`,
    '',
    itemsLines,
  ].join('\n')

  const appUrl = getAppUrl()
  const replyMarkup = appUrl
    ? {
        inline_keyboard: [
          [
            {
              text: 'Открыть заказы',
              web_app: { url: `${appUrl}/admin/orders` },
            },
          ],
        ],
      }
    : undefined

  await Promise.allSettled(
    admins.map((admin) =>
      callTelegramApi('sendMessage', {
        chat_id: admin.telegramId.toString(),
        text: `${BRAND_NAME}\n\n${text}`,
        ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
      }),
    ),
  )
}
