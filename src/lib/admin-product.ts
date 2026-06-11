export type ProductFormPayload = {
  name: string
  price: number
  image: string
  categoryId: string
  description: string
  careTips: string
  active: boolean
}

export function slugifyProductId(name: string): string {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9а-яё-]/gi, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48)
  return slug || 'product'
}

export function parseProductFormBody(body: Record<string, unknown>): ProductFormPayload | string {
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const image = typeof body.image === 'string' ? body.image.trim() : ''
  const categoryId = typeof body.categoryId === 'string' ? body.categoryId.trim() : ''
  const description = typeof body.description === 'string' ? body.description.trim() : ''
  const careTips = typeof body.careTips === 'string' ? body.careTips.trim() : ''
  const priceRaw = body.price
  const price =
    typeof priceRaw === 'number'
      ? Math.round(priceRaw)
      : typeof priceRaw === 'string'
        ? Math.round(Number(priceRaw))
        : NaN
  const active = typeof body.active === 'boolean' ? body.active : true

  if (!name) return 'Укажите название'
  if (!Number.isFinite(price) || price <= 0) return 'Укажите корректную цену'
  if (!image) return 'Загрузите изображение'
  if (!image.startsWith('/uploads/') && !image.startsWith('http://') && !image.startsWith('https://')) {
    return 'Некорректный путь к изображению'
  }
  if (!categoryId) return 'Выберите категорию'
  if (!description) return 'Добавьте описание'
  if (!careTips) return 'Добавьте советы по уходу'

  return { name, price, image, categoryId, description, careTips, active }
}
