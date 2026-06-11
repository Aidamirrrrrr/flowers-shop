import type { PointerEventHandler } from 'react'
import { hapticImpact, hapticSelection, type HapticImpact } from './haptic'

export type HapticPress = false | HapticImpact | 'selection'

export function fireHaptic(style: HapticPress) {
  if (style === false) return
  if (style === 'selection') hapticSelection()
  else hapticImpact(style)
}

export function onHapticPointerDown(
  style: HapticPress,
  handler?: PointerEventHandler<HTMLElement>,
): PointerEventHandler<HTMLElement> {
  return (event) => {
    if (event.button === 0) fireHaptic(style)
    handler?.(event)
  }
}
