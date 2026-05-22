import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Check, Droplets, ShoppingCart, Truck } from 'lucide-react'
import { getProductById } from '../data/products'
import { useCart } from '../hooks/useCart'
import { Price } from '../components/ui/Price'
import { Button } from '../components/ui/Button'
import { Icon } from '../components/ui/Icon'
import { hapticImpact } from '../telegram/haptic'

export function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addItem, getQty } = useCart()
  const [justAdded, setJustAdded] = useState(false)
  const product = id ? getProductById(id) : undefined

  if (!product) {
    return (
      <div className="empty-state">
        <h2>Товар не найден</h2>
        <Button variant="outline" onClick={() => navigate('/')}>
          На главную
        </Button>
      </div>
    )
  }

  const qty = getQty(product.id)

  const handleAdd = () => {
    addItem(product.id)
    hapticImpact('medium')
    setJustAdded(true)
    window.setTimeout(() => setJustAdded(false), 600)
  }

  const buttonLabel =
    qty > 0 ? `В корзине · ${qty} шт.` : 'В корзину'

  return (
    <>
      <img src={product.image} alt={product.name} className="product-hero" />
      <h1 className="product-page__title">{product.name}</h1>
      <div className="product-page__meta">
        <Price value={product.price} large />
      </div>
      <p className="product-page__desc">{product.description}</p>

      <div className="info-block">
        <div className="info-block__head">
          <Icon icon={Droplets} size={18} />
          <h3>Уход за букетом</h3>
        </div>
        <p>{product.careTips}</p>
      </div>

      <Link to="/about#delivery" className="product-page__link">
        <Icon icon={Truck} size={16} />
        О доставке и оплате
      </Link>

      <div className="sticky-actions sticky-actions--product">
        <Button
          variant="primary"
          block
          className={justAdded ? 'btn--pulse' : ''}
          onClick={handleAdd}
        >
          {justAdded ? (
            <Icon icon={Check} size={20} />
          ) : (
            <Icon icon={ShoppingCart} size={20} />
          )}
          {justAdded ? 'Добавлено' : buttonLabel}
        </Button>
      </div>
    </>
  )
}
