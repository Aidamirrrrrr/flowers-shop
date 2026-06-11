import { formatPrice } from '@/lib/format-price'
import { cn } from '@/lib/utils'

type PriceProps = {
  value: number
  large?: boolean
}

export function Price({ value, large }: PriceProps) {
  return (
    <span className={cn('font-semibold tabular-nums', large ? 'text-xl' : 'text-sm')}>
      {formatPrice(value)}
    </span>
  )
}
