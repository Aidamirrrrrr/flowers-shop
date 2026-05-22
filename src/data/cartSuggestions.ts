import { getProductById, type Product } from './products'

/** Товары для ленты «Вам может пригодиться» в корзине (не весь каталог) */
export const CART_SUGGESTION_IDS = ['19', '20', '18'] as const

export function getCartSuggestionProducts(): Product[] {
  return CART_SUGGESTION_IDS.map((id) => getProductById(id)).filter(
    (p): p is Product => p !== undefined,
  )
}
