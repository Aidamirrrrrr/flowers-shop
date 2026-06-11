'use client'

import { forwardRef, useImperativeHandle, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PhoneInput } from '@/components/ui/phone-input'
import { DeliveryDateTimePicker } from '@/components/cart/DeliveryDateTimePicker'
import { isValidPhone, normalizePhone } from '@/lib/phone-mask'

export type CheckoutData = {
  name: string
  phone: string
  address: string
  datetime: string
}

export type CheckoutFormRef = {
  validateAndGetData: () => CheckoutData | null
}

export const CheckoutForm = forwardRef<CheckoutFormRef>(function CheckoutForm(_, ref) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [datetime, setDatetime] = useState('')
  const [error, setError] = useState('')

  useImperativeHandle(ref, () => ({
    validateAndGetData() {
      if (!name.trim()) {
        setError('Укажите имя получателя')
        return null
      }
      if (!isValidPhone(phone)) {
        setError('Укажите корректный телефон')
        return null
      }
      if (!address.trim()) {
        setError('Укажите адрес доставки')
        return null
      }
      if (!datetime) {
        setError('Выберите дату и время доставки')
        return null
      }
      setError('')
      return {
        name: name.trim(),
        phone: normalizePhone(phone),
        address: address.trim(),
        datetime,
      }
    },
  }))

  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="checkout-name">Имя получателя</Label>
        <Input
          id="checkout-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Анна"
          autoComplete="name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="checkout-phone">Телефон</Label>
        <PhoneInput
          id="checkout-phone"
          value={phone}
          onChange={setPhone}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="checkout-address">Адрес доставки</Label>
        <Textarea
          id="checkout-address"
          rows={3}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Город, улица, дом, квартира"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="checkout-datetime">Дата и время</Label>
        <DeliveryDateTimePicker
          id="checkout-datetime"
          value={datetime}
          onChange={setDatetime}
        />
      </div>
    </form>
  )
})
