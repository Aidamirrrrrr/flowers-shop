'use client'

import { useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '../hooks/useCart'
import { formatPrice, getProductById } from '../data/products'
import {
  CheckoutForm,
  type CheckoutFormRef,
} from '../components/cart/CheckoutForm'
import { PageHeader } from '../components/layout/PageHeader'
import { Button } from '../components/ui/Button'
import { hapticNotification } from '../telegram/haptic'
import { showDemoAlert } from '../telegram/useTelegram'

export function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()
  const formRef = useRef<CheckoutFormRef>(null)

  const handleSubmit = useCallback(() => {
    const data = formRef.current?.validateAndGetData()
    if (!data) {
      hapticNotification('error')
      return
    }

    const postcards = items
      .filter((i) => i.postcardText)
      .map((i) => {
        const name = getProductById(i.productId)?.name ?? 'Букет'
        return `${name}: «${i.postcardText}»`
      })
    const postcardBlock =
      postcards.length > 0 ? `\n\nОткрытки:\n${postcards.join('\n')}` : ''

    hapticNotification('success')
    clearCart()
    showDemoAlert(
      `Заказ принят (демо)!\n\n${data.name}\n${data.phone}\n${data.address}\n${data.datetime}${postcardBlock}`,
    )
    router.push('/profile')
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
      <p style={{ margin: '0 0 16px', color: 'var(--tg-hint)' }}>
        К оплате: <strong>{formatPrice(total)}</strong>
      </p>
      <CheckoutForm ref={formRef} />
      <div style={{ marginTop: 24 }}>
        <Button variant="primary" block onClick={handleSubmit}>
          Подтвердить заказ
        </Button>
      </div>
      <p style={{ marginTop: 16, fontSize: '0.85rem', color: 'var(--tg-hint)' }}>
        Демо-режим: заказ не отправляется на сервер.
      </p>
    </>
  )
}
