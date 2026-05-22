/** Логотип бренда из public/Symbol black.png (символ с большими полями в файле) */
export const BRAND_LOGO_SRC = '/Symbol%20black.png'

type LogoProps = {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Logo({ size = 'sm', className = '' }: LogoProps) {
  return (
    <span
      className={`brand-logo-wrap brand-logo-wrap--${size} ${className}`.trim()}
      aria-hidden
    >
      <img src={BRAND_LOGO_SRC} alt="" className="brand-logo" decoding="async" />
    </span>
  )
}
