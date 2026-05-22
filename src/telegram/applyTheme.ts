import {
  BRAND_THEME_DARK,
  BRAND_THEME_LIGHT,
  type BrandThemeKey,
} from '../styles/brandTheme'
import { getWebApp } from './webApp'

const THEME_MAP: [string, BrandThemeKey][] = [
  ['--tg-bg', 'bg_color'],
  ['--tg-text', 'text_color'],
  ['--tg-hint', 'hint_color'],
  ['--tg-link', 'link_color'],
  ['--tg-button', 'button_color'],
  ['--tg-button-text', 'button_text_color'],
  ['--tg-secondary-bg', 'secondary_bg_color'],
  ['--tg-accent', 'accent_text_color'],
  ['--tg-destructive', 'destructive_text_color'],
  ['--tg-header-bg', 'header_bg_color'],
  ['--tg-section-bg', 'section_bg_color'],
  ['--tg-subtitle', 'subtitle_text_color'],
]

export function applyTelegramTheme() {
  const scheme =
    String(getWebApp().colorScheme) === 'dark' ? 'dark' : 'light'
  const palette = scheme === 'dark' ? BRAND_THEME_DARK : BRAND_THEME_LIGHT
  const root = document.documentElement

  for (const [cssVar, key] of THEME_MAP) {
    root.style.setProperty(cssVar, palette[key])
  }

  root.dataset.tgScheme = scheme
}
