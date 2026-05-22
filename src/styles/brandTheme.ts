/** Монохромная палитра в духе elementbymosk.ru */
export const BRAND_THEME_LIGHT = {
  bg_color: '#ffffff',
  text_color: '#111111',
  hint_color: '#737373',
  link_color: '#111111',
  button_color: '#111111',
  button_text_color: '#ffffff',
  secondary_bg_color: '#f5f5f5',
  accent_text_color: '#111111',
  destructive_text_color: '#111111',
  header_bg_color: '#ffffff',
  section_bg_color: '#ffffff',
  subtitle_text_color: '#525252',
} as const

export const BRAND_THEME_DARK = {
  bg_color: '#0a0a0a',
  text_color: '#fafafa',
  hint_color: '#a3a3a3',
  link_color: '#ffffff',
  button_color: '#ffffff',
  button_text_color: '#0a0a0a',
  secondary_bg_color: '#171717',
  accent_text_color: '#fafafa',
  destructive_text_color: '#fafafa',
  header_bg_color: '#0a0a0a',
  section_bg_color: '#141414',
  subtitle_text_color: '#d4d4d4',
} as const

export type BrandThemeKey = keyof typeof BRAND_THEME_LIGHT
