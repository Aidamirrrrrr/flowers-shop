import { cn } from '@/lib/utils'

/** Логотип бренда из public/Symbol black.jpeg */
export const BRAND_LOGO_SRC = '/Symbol%20black.jpeg'

type LogoProps = {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZES = {
  sm: 24,
  md: 32,
  lg: 48,
} as const

const sizeClasses = {
  sm: 'size-6',
  md: 'size-8',
  lg: 'size-12',
} as const

export function Logo({ size = 'sm', className }: LogoProps) {
  const px = SIZES[size]
  return (
    <img
      src={BRAND_LOGO_SRC}
      alt=""
      className={cn('logo-invert-dark block shrink-0 object-contain', sizeClasses[size], className)}
      width={px}
      height={px}
      decoding="async"
    />
  )
}
