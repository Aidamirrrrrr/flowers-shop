'use client'

import { useRef, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/lib/format-price'
import {
  CheckoutForm,
  type CheckoutFormRef,
} from '@/components/cart/CheckoutForm'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { hapticNotification } from '@/telegram/haptic'
import { showDemoAlert } from '@/telegram/useTelegram'
import { getWebApp } from '@/telegram/webApp'

export function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()
  const formRef = useRef<CheckoutFormRef>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = useCallback(async () => {
    const data = formRef.current?.validateAndGetData()
    if (!data) {
      hapticNotification('error')
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      const initData = getWebApp().initData ?? ''
      await fetch('/api/auth/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData }),
        credentials: 'include',
      })

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          customerName: data.name,
          phone: data.phone,
          address: data.address,
          deliveryAt: data.datetime,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            postcardText: i.postcardText,
          })),
        }),
      })

      const payload = (await res.json()) as {
        error?: string
        order?: { shortId: string; total: number; deliveryAt: string }
      }

      if (!res.ok) {
        hapticNotification('error')
        setError(payload.error ?? 'Не удалось оформить заказ')
        return
      }

      hapticNotification('success')
      clearCart()
      showDemoAlert(
        `Заказ №${payload.order!.shortId} принят!\n\nОплата при получении.\nСумма: ${formatPrice(payload.order!.total)}\nДоставка: ${payload.order!.deliveryAt}`,
      )
      router.push('/profile')
    } catch {
      hapticNotification('error')
      setError('Ошибка сети. Проверьте подключение и попробуйте снова.')
    } finally {
      setSubmitting(false)
    }
  }, [clearCart, router, items])

  useEffect(() => {
    if (items.length === 0) {
      router.replace('/cart')
    }
  }, [items.length, router])

  if (items.length === 0) {
    return null
  }

  return (
    <>
      <PageHeader title="Оформление" />
      <p className="mb-4 text-muted-foreground">
        К оплате: <strong className="text-foreground">{formatPrice(total)}</strong>
      </p>
      <p className="mb-4 text-sm text-muted-foreground">
        Оплата наличными или картой курьеру при получении.
      </p>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <CheckoutForm ref={formRef} />
      <div className="mt-6">
        <Button className="w-full" onClick={handleSubmit} disabled={submitting}>
          {submitting ? 'Отправляем…' : 'Подтвердить заказ'}
        </Button>
      </div>
    </>
  )
}
