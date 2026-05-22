import { isDevMockActive } from './mockWebApp'
import { getWebApp } from './webApp'

export type HapticImpact = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'
export type HapticNotification = 'error' | 'success' | 'warning'

const IMPACT_VIBRATE: Record<HapticImpact, number | number[]> = {
  light: 12,
  medium: 22,
  heavy: 35,
  rigid: 18,
  soft: 8,
}

const NOTIFICATION_VIBRATE: Record<HapticNotification, number[]> = {
  success: [12, 40, 12],
  warning: [20, 30, 20],
  error: [35, 60, 35],
}

function webVibrate(pattern: number | number[]) {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return
  try {
    navigator.vibrate(pattern)
  } catch {
    /* iOS / policy */
  }
}

/** Удар — добавление в корзину, тап по CTA */
export function hapticImpact(style: HapticImpact = 'light') {
  getWebApp().HapticFeedback.impactOccurred(style)
  if (isDevMockActive()) webVibrate(IMPACT_VIBRATE[style])
}

/** Успех / ошибка — оформление заказа */
export function hapticNotification(type: HapticNotification) {
  getWebApp().HapticFeedback.notificationOccurred(type)
  if (isDevMockActive()) webVibrate(NOTIFICATION_VIBRATE[type])
}

/** Переключатели — категории, +/- количество */
export function hapticSelection() {
  getWebApp().HapticFeedback.selectionChanged()
  if (isDevMockActive()) webVibrate(8)
}
