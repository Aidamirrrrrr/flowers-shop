'use client'

import { useId, useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { hapticSelection } from '@/telegram/haptic'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@/components/ui/Icon'

const MAX_LENGTH = 200

type PostcardFieldProps = {
  productId: string
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
    <Card className="animate-fade-in-up mb-4 gap-0 overflow-hidden py-0 shadow-none">
      <Button
        type="button"
        variant="ghost"
        className="h-auto w-full justify-between rounded-none px-4 py-3 text-sm font-medium"
        onClick={toggleOpen}
      >
        <span className="flex items-center gap-2">
          <Icon icon={MessageSquare} size={18} />
          {open ? 'Открытка добавлена' : 'Добавить открытку'}
        </span>
        <span className="text-lg leading-none text-muted-foreground" aria-hidden>
          {open ? '−' : '+'}
        </span>
      </Button>

      {open && (
        <CardContent className="space-y-2 border-t border-border px-4 pb-4 pt-3">
          <Label htmlFor={textareaId}>Текст для получателя</Label>
          <Textarea
            id={textareaId}
            rows={4}
            maxLength={MAX_LENGTH}
            placeholder="Напишите пожелание — мы напечатаем на открытке"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleBlur}
          />
          <p className="text-xs text-muted-foreground">
            {text.length}/{MAX_LENGTH} · сохранится в корзине
          </p>
        </CardContent>
      )}
    </Card>
  )
}
