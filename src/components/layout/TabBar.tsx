import { Home, ShoppingCart, User } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { Icon } from '../ui/Icon'

export function TabBar() {
  const { itemCount } = useCart()

  return (
    <nav className="tab-bar" aria-label="Основная навигация">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `tab-bar__item${isActive ? ' tab-bar__item--active' : ''}`
        }
      >
        <span className="tab-bar__icon-wrap">
          <Icon icon={Home} size={22} />
        </span>
        Главная
      </NavLink>
      <NavLink
        to="/cart"
        className={({ isActive }) =>
          `tab-bar__item${isActive ? ' tab-bar__item--active' : ''}`
        }
      >
        <span className="tab-bar__icon-wrap">
          <Icon icon={ShoppingCart} size={22} />
        </span>
        Корзина
        {itemCount > 0 && (
          <span className="tab-bar__badge" aria-label={`${itemCount} в корзине`}>
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </NavLink>
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `tab-bar__item${isActive ? ' tab-bar__item--active' : ''}`
        }
      >
        <span className="tab-bar__icon-wrap">
          <Icon icon={User} size={22} />
        </span>
        Профиль
      </NavLink>
    </nav>
  )
}
