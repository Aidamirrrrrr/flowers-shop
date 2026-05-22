import type { LucideIcon } from 'lucide-react'

type IconProps = {
  icon: LucideIcon
  size?: number
  className?: string
  strokeWidth?: number
}

export function Icon({
  icon: LucideComponent,
  size = 20,
  className,
  strokeWidth = 2,
}: IconProps) {
  return (
    <LucideComponent
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden
    />
  )
}
