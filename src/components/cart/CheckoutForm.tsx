import { forwardRef, useImperativeHandle, useState } from 'react'

export type CheckoutData = {
  name: string
  phone: string
  address: string
  datetime: string
}

export type CheckoutFormRef = {
  validateAndGetData: () => CheckoutData | null
}

export const CheckoutForm = forwardRef<CheckoutFormRef>(function CheckoutForm(
  _,
  ref,
) {
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
      if (!phone.trim() || phone.trim().length < 6) {
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
      return { name: name.trim(), phone: phone.trim(), address: address.trim(), datetime }
    },
  }))

  return (
    <form className="checkout-form" onSubmit={(e) => e.preventDefault()}>
      {error && (
        <p style={{ color: 'var(--tg-text)', margin: 0, fontSize: '0.9rem' }}>
          {error}
        </p>
      )}
      <div className="form-field">
        <label htmlFor="checkout-name">Имя получателя</label>
        <input
          id="checkout-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Анна"
          autoComplete="name"
        />
      </div>
      <div className="form-field">
        <label htmlFor="checkout-phone">Телефон</label>
        <input
          id="checkout-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+7 900 000-00-00"
          autoComplete="tel"
        />
      </div>
      <div className="form-field">
        <label htmlFor="checkout-address">Адрес доставки</label>
        <textarea
          id="checkout-address"
          rows={3}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Город, улица, дом, квартира"
        />
      </div>
      <div className="form-field">
        <label htmlFor="checkout-datetime">Дата и время</label>
        <input
          id="checkout-datetime"
          type="datetime-local"
          value={datetime}
          onChange={(e) => setDatetime(e.target.value)}
        />
      </div>
    </form>
  )
})
