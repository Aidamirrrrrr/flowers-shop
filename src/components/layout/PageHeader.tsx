import type { ReactNode } from 'react'
import { Logo } from '../ui/Logo'

type PageHeaderProps = {
  title: string
  largeLogo?: boolean
  children?: ReactNode
}

export function PageHeader({ title, largeLogo, children }: PageHeaderProps) {
  return (
    <header className={`page-header${largeLogo ? ' page-header--brand' : ''}`}>
      <Logo size={largeLogo ? 'md' : 'sm'} />
      <h1>{title}</h1>
      {children}
    </header>
  )
}
