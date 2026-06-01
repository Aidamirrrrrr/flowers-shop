'use client'

import { ChevronRight, MessageCircle } from 'lucide-react'
import { useTelegramUser, openSupport } from '../telegram/useTelegram'
import { PageHeader } from '../components/layout/PageHeader'
import { Icon } from '../components/ui/Icon'

const MOCK_ORDERS = [
  { id: '1042', title: 'Кремовые розы с эвкалиптом', date: '12 мая 2026', status: 'Доставлен' },
  { id: '1038', title: 'Букет «Нежность»', date: '28 апр 2026', status: 'Доставлен' },
]

export function ProfilePage() {
  const user = useTelegramUser()
  const displayName = user
    ? [user.first_name, user.last_name].filter(Boolean).join(' ')
    : 'Гость'
  const username = user?.username ? `@${user.username}` : 'Демо-профиль'

  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <>
      <PageHeader title="Профиль" />
      <div className="profile-header">
        <div className="profile-avatar">
          {user?.photo_url ? (
            <img src={user.photo_url} alt="" />
          ) : (
            initials
          )}
        </div>
        <div>
          <h2 className="profile-name">{displayName}</h2>
          <p className="profile-sub">{username}</p>
        </div>
      </div>

      <nav className="menu-list" aria-label="Меню профиля">
        <button type="button" className="menu-item" onClick={openSupport}>
          <span className="menu-item__label">
            <Icon icon={MessageCircle} size={20} />
            Написать в поддержку
          </span>
          <Icon icon={ChevronRight} size={18} className="menu-item__arrow" />
        </button>
      </nav>

      <section className="orders-section">
        <h2>История заказов</h2>
        {MOCK_ORDERS.map((order) => (
          <div key={order.id} className="order-card">
            <p className="order-card__title">{order.title}</p>
            <p className="order-card__meta">
              №{order.id} · {order.date} · {order.status}
            </p>
          </div>
        ))}
      </section>
    </>
  )
}
