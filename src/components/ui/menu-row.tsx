import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type MenuRowProps = {
  icon: LucideIcon
  label: string
  href?: string
  onClick?: () => void
  className?: string
}

export function MenuRow({ icon: Icon, label, href, onClick, className }: MenuRowProps) {
  const content = (
    <>
      <span className="flex items-center gap-3 text-sm font-medium">
        <Icon className="h-5 w-5 shrink-0 text-foreground" />
        {label}
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
    </>
  )

  const base = cn(
    'flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors',
    'hover:bg-muted/50 active:bg-muted',
    className,
  )

  if (href) {
    return (
      <Link href={href} className={base}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" className={base} onClick={onClick}>
      {content}
    </button>
  )
}
