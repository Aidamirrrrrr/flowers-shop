import { useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { formatPrice } from '../data/products'
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
  const navigate = useNavigate()
  const formRef = useRef<CheckoutFormRef>(null)

  const handleSubmit = useCallback(() => {
    const data = formRef.current?.validateAndGetData()
    if (!data) {
      hapticNotification('error')
      return
    }

    hapticNotification('success')
    clearCart()
    showDemoAlert(
      `Заказ принят (демо)!\n\n${data.name}\n${data.phone}\n${data.address}\n${data.datetime}`,
    )
    navigate('/profile')
  }, [clearCart, navigate])

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart', { replace: true })
    }
  }, [items.length, navigate])

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
