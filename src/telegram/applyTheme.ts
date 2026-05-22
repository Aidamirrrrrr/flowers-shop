import { getWebApp } from './webApp'

const THEME_MAP: [string, string][] = [
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
  const tp = getWebApp().themeParams
  const root = document.documentElement

  for (const [cssVar, key] of THEME_MAP) {
    const value = tp[key as keyof typeof tp]
    if (value) root.style.setProperty(cssVar, value)
  }

  const scheme = getWebApp().colorScheme
  root.dataset.tgScheme = scheme
}
