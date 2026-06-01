import { formatPrice as formatPriceStatic } from '@/data/products'

export type CatalogProduct = {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
  careTips: string
}

export function formatPrice(price: number): string {
  return formatPriceStatic(price)
}

export function mapDbProduct(p: {
  id: string
  name: string
  price: number
  image: string
  categoryId: string
  description: string
  careTips: string
}): CatalogProduct {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    category: p.categoryId,
    description: p.description,
    careTips: p.careTips,
  }
}
