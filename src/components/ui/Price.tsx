import { formatPrice } from '../../data/products'

type PriceProps = {
  value: number
  large?: boolean
}

export function Price({ value, large }: PriceProps) {
  return (
    <span className={large ? 'price price--lg' : 'price'}>
      {formatPrice(value)}
    </span>
  )
}
