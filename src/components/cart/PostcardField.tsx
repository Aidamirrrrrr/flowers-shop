import { useId, useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { useCart } from '../../hooks/useCart'
import { hapticSelection } from '../../telegram/haptic'
import { Icon } from '../ui/Icon'

const MAX_LENGTH = 200

type PostcardFieldProps = {
  productId: string
  /** Показывать блок только если товар уже в корзине */
  requireInCart?: boolean
}

export function PostcardField({ productId, requireInCart = true }: PostcardFieldProps) {
  const { getQty, getPostcardText, setPostcardText } = useCart()
  const textareaId = useId()
  const qty = getQty(productId)
  const savedText = getPostcardText(productId)

  const [open, setOpen] = useState(() => Boolean(savedText))
  const [text, setText] = useState(savedText)

  if (requireInCart && qty === 0) {
    return null
  }

  const toggleOpen = () => {
    hapticSelection()
    setOpen((v) => {
      const next = !v
      if (!next) {
        setText('')
        setPostcardText(productId, '')
      }
      return next
    })
  }

  const handleBlur = () => {
    setPostcardText(productId, text)
  }

  return (
    <div className="postcard-block">
      <button type="button" className="postcard-block__toggle" onClick={toggleOpen}>
        <span className="postcard-block__toggle-label">
          <Icon icon={MessageSquare} size={18} />
          {open ? 'Открытка добавлена' : 'Добавить открытку'}
        </span>
        <span className="postcard-block__chevron" aria-hidden>
          {open ? '−' : '+'}
        </span>
      </button>

      {open && (
        <div className="postcard-block__body">
          <label htmlFor={textareaId} className="postcard-block__label">
            Текст для получателя
          </label>
          <textarea
            id={textareaId}
            className="postcard-block__input"
            rows={4}
            maxLength={MAX_LENGTH}
            placeholder="Напишите пожелание — мы напечатаем на открытке"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleBlur}
          />
          <p className="postcard-block__hint">
            {text.length}/{MAX_LENGTH} · сохранится в корзине
          </p>
        </div>
      )}
    </div>
  )
}
