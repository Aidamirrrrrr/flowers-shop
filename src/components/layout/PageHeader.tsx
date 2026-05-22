import { Flower2, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Icon } from '../ui/Icon'

type PageHeaderProps = {
  title: string
  icon?: LucideIcon
  children?: ReactNode
}

export function PageHeader({ title, icon = Flower2, children }: PageHeaderProps) {
  return (
    <header className="page-header">
      <span className="page-header__icon">
        <Icon icon={icon} size={22} />
      </span>
      <h1>{title}</h1>
      {children}
    </header>
  )
}
