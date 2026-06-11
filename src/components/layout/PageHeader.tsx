import type { ReactNode } from 'react'
import { Logo } from '../ui/Logo'
import { cn } from '@/lib/utils'

type PageHeaderProps = {
  title: string
  largeLogo?: boolean
  children?: ReactNode
}

export function PageHeader({ title, largeLogo, children }: PageHeaderProps) {
  return (
    <header
      className={cn(
        'mb-3 flex min-h-12 items-center gap-2',
        largeLogo && 'mb-4 gap-3',
      )}
    >
      <Logo size={largeLogo ? 'md' : 'sm'} />
      <h1 className="m-0 text-[0.95rem] font-medium uppercase tracking-[0.12em]">{title}</h1>
      {children}
    </header>
  )
}
