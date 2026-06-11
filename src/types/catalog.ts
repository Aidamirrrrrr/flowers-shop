export type CatalogCategory = {
  id: string
  label: string
}

export type CatalogProduct = {
  id: string
  name: string
  price: number
  image: string
  categoryId: string
  categoryLabel: string
  description: string
  careTips: string
  active: boolean
}
