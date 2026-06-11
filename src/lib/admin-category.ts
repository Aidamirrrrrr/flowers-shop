export function slugifyCategoryId(label: string): string {
  const slug = label
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9а-яё-]/gi, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48)
  return slug || 'category'
}

export function parseCategoryBody(body: Record<string, unknown>): { label: string; sort?: number } | string {
  const label = typeof body.label === 'string' ? body.label.trim() : ''
  if (!label) return 'Укажите название категории'

  let sort: number | undefined
  if (body.sort !== undefined) {
    const n = typeof body.sort === 'number' ? body.sort : Number(body.sort)
    if (!Number.isFinite(n)) return 'Некорректный порядок сортировки'
    sort = Math.round(n)
  }

  return { label, sort }
}
