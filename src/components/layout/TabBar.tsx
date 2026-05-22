import { Home, Info, ShoppingCart, User } from 'lucide-react'
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
          <Icon icon={Home} size={20} />
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
          <Icon icon={ShoppingCart} size={20} />
        </span>
        Корзина
        {itemCount > 0 && (
          <span className="tab-bar__badge" aria-label={`${itemCount} в корзине`}>
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </NavLink>
      <NavLink
        to="/about"
        className={({ isActive }) =>
          `tab-bar__item${isActive ? ' tab-bar__item--active' : ''}`
        }
      >
        <span className="tab-bar__icon-wrap">
          <Icon icon={Info} size={20} />
        </span>
        О нас
      </NavLink>
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `tab-bar__item${isActive ? ' tab-bar__item--active' : ''}`
        }
      >
        <span className="tab-bar__icon-wrap">
          <Icon icon={User} size={20} />
        </span>
        Профиль
      </NavLink>
    </nav>
  )
}
