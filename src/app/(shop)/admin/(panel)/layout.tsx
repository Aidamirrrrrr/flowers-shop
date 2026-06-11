import type { ReactNode } from 'react'
import { AdminNav } from '@/components/admin/AdminNav'
import { PageHeader } from '@/components/layout/PageHeader'

export default function AdminPanelLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-4">
      <PageHeader title="Админ-панель" />
      <AdminNav />
      {children}
    </div>
  )
}
