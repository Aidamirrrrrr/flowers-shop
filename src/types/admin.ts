import type { OrderStatusKey } from '@/lib/order-status-labels'

export type AdminCategory = {
  id: string
  label: string
  sort: number
  productCount: number
}

export type AdminProduct = {
  id: string
  name: string
  price: number
  image: string
  categoryId: string
  category: string
  description: string
  careTips: string
  active: boolean
}

export type AdminUser = {
  id: string
  telegramId: string
  username: string | null
  displayName: string
  role: 'USER' | 'ADMIN'
  orderCount: number
  createdAtLabel: string
}

export type AdminOrder = {
  id: string
  shortId: string
  status: OrderStatusKey
  statusLabel: string
  customerName: string
  phone: string
  address: string
  deliveryAt: string
  deliveryAtLabel: string
  createdAtLabel: string
  total: number
  userLabel?: string
  items: { name: string; quantity: number; price: number; postcardText: string | null }[]
}

export type ProductFormValues = {
  name: string
  price: string
  image: string
  categoryId: string
  description: string
  careTips: string
  active: boolean
}

export const EMPTY_PRODUCT_FORM: ProductFormValues = {
  name: '',
  price: '',
  image: '',
  categoryId: '',
  description: '',
  careTips: '',
  active: true,
}

export type CategoryFormValues = {
  label: string
  sort: string
}

export const EMPTY_CATEGORY_FORM: CategoryFormValues = {
  label: '',
  sort: '',
}
