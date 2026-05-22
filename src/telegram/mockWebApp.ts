type ClickHandler = () => void

export type MockWebApp = ReturnType<typeof createMockWebApp>

export function createMockWebApp() {
  const backHandlers = new Set<ClickHandler>()
  const mainHandlers = new Set<ClickHandler>()

  let backVisible = false
  let mainVisible = false
  let mainText = 'OK'
  let mainDisabled = false

  const notify = () => {
    window.dispatchEvent(new CustomEvent('tg-mock-update'))
  }

  const BackButton = {
    get isVisible() {
      return backVisible
    },
    show() {
      backVisible = true
      notify()
    },
    hide() {
      backVisible = false
      notify()
    },
    onClick(handler: ClickHandler) {
      backHandlers.add(handler)
    },
    offClick(handler: ClickHandler) {
      backHandlers.delete(handler)
    },
    click() {
      backHandlers.forEach((h) => h())
    },
  }

  const MainButton = {
    get isVisible() {
      return mainVisible
    },
    get text() {
      return mainText
    },
    get isActive() {
      return !mainDisabled
    },
    setText(text: string) {
      mainText = text
      notify()
    },
    show() {
      mainVisible = true
      notify()
    },
    hide() {
      mainVisible = false
      notify()
    },
    enable() {
      mainDisabled = false
      notify()
    },
    disable() {
      mainDisabled = true
      notify()
    },
    onClick(handler: ClickHandler) {
      mainHandlers.add(handler)
    },
    offClick(handler: ClickHandler) {
      mainHandlers.delete(handler)
    },
    click() {
      if (!mainDisabled) mainHandlers.forEach((h) => h())
    },
  }

  return {
    platform: 'web' as const,
    version: '7.0-mock',
    initData: '',
    initDataUnsafe: {
      user: {
        id: 100001,
        first_name: 'Анна',
        last_name: 'Демо',
        username: 'demo_flowers',
        language_code: 'ru',
        allows_write_to_pm: true,
        photo_url: undefined as string | undefined,
      },
    },
    themeParams: {
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
    },
    colorScheme: 'light' as const,
    isExpanded: true,
    viewportHeight: window.innerHeight,
    viewportStableHeight: window.innerHeight,

    ready() {
      console.info('[tg-mock] WebApp.ready()')
    },
    expand() {
      console.info('[tg-mock] WebApp.expand()')
    },
    close() {
      console.info('[tg-mock] WebApp.close()')
    },

    BackButton,
    MainButton,

    HapticFeedback: {
      impactOccurred(style: string) {
        console.debug('[tg-mock] haptic impact:', style)
      },
      notificationOccurred(type: string) {
        console.debug('[tg-mock] haptic notification:', type)
      },
      selectionChanged() {
        console.debug('[tg-mock] haptic selection')
      },
    },

    showAlert(message: string, callback?: () => void) {
      window.alert(message)
      callback?.()
    },

    showConfirm(message: string, callback?: (ok: boolean) => void) {
      const ok = window.confirm(message)
      callback?.(ok)
    },

    openTelegramLink(url: string) {
      window.open(url, '_blank', 'noopener,noreferrer')
    },

    openLink(url: string) {
      window.open(url, '_blank', 'noopener,noreferrer')
    },
  }
}

let devMockActive = false

export function isDevMockActive() {
  return devMockActive
}

type TelegramWindow = Window & {
  Telegram?: { WebApp: MockWebApp }
}

function getTelegramWindow(): TelegramWindow {
  return window as TelegramWindow
}

export function getMockWebApp(): MockWebApp | null {
  if (!devMockActive) return null
  return getTelegramWindow().Telegram?.WebApp ?? null
}

function isRealTelegramWebApp(
  app: MockWebApp | { initData?: string; ready?: unknown } | undefined,
): boolean {
  return (
    typeof app?.initData === 'string' &&
    app.initData.length > 0 &&
    typeof app.ready === 'function'
  )
}

export function initDevTelegramMock() {
  if (!import.meta.env.DEV) return

  const win = getTelegramWindow()
  const existing = win.Telegram?.WebApp

  if (isRealTelegramWebApp(existing)) {
    console.info('[tg-mock] Real Telegram WebApp detected, mock skipped')
    return
  }

  const mock = createMockWebApp()
  win.Telegram = { WebApp: mock }
  devMockActive = true
  console.info('[tg-mock] Telegram WebApp mocked for local dev')
}
