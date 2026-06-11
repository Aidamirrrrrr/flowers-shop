export type PhoneFormat = 'ru' | 'intl'

/** Определяет формат по вводу: +7/8 — Россия, иначе международный */
export function detectPhoneFormat(input: string): PhoneFormat {
  const trimmed = input.trim()
  if (!trimmed) return 'ru'

  const digits = trimmed.replace(/\D/g, '')
  if (trimmed.startsWith('+7') || trimmed.startsWith('7') || trimmed.startsWith('8')) {
    return 'ru'
  }
  if (trimmed.startsWith('+') && digits.length > 0 && !digits.startsWith('7')) {
    return 'intl'
  }
  if (digits.startsWith('8') || (digits.startsWith('7') && digits.length <= 11)) {
    return 'ru'
  }
  return 'ru'
}

function formatRussian(digits: string): string {
  let d = digits
  if (d.startsWith('8')) d = '7' + d.slice(1)
  if (!d.startsWith('7') && d.length > 0) d = '7' + d
  d = d.slice(0, 11)

  const body = d.slice(1)
  if (body.length === 0) return '+7'

  let out = '+7'
  if (body.length <= 3) return `${out} (${body}`
  out += ` (${body.slice(0, 3)})`
  if (body.length <= 6) return `${out} ${body.slice(3)}`
  out += ` ${body.slice(3, 6)}`
  if (body.length <= 8) return `${out}-${body.slice(6)}`
  return `${out}-${body.slice(6, 8)}-${body.slice(8, 10)}`
}

function formatInternational(digits: string): string {
  const d = digits.slice(0, 15)
  if (d.length === 0) return '+'
  let out = '+'
  for (let i = 0; i < d.length; i++) {
    if (i > 0 && i % 3 === 0) out += ' '
    out += d[i]
  }
  return out
}

export function formatPhoneInput(raw: string): string {
  const trimmed = raw.trimStart()
  if (!trimmed) return ''

  const digits = trimmed.replace(/\D/g, '')
  const format = detectPhoneFormat(trimmed)

  if (format === 'intl') {
    const intlDigits = trimmed.startsWith('+') ? digits : digits
    return formatInternational(intlDigits)
  }

  return formatRussian(digits)
}

export function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '')
  const format = detectPhoneFormat(value)

  if (format === 'ru') {
    const normalized = digits.startsWith('8') ? '7' + digits.slice(1) : digits
    return normalized.length === 11 && normalized.startsWith('7')
  }

  return digits.length >= 10 && digits.length <= 15
}

/** Нормализованный номер для API: +7XXXXXXXXXX или +<intl> */
export function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, '')
  const format = detectPhoneFormat(value)

  if (format === 'ru') {
    const normalized = digits.startsWith('8') ? '7' + digits.slice(1) : digits
    const body = normalized.startsWith('7') ? normalized : `7${normalized}`
    return `+${body.slice(0, 11)}`
  }

  return `+${digits}`
}

export const PHONE_FORMAT_HINT =
  'Форматы: +7 (900) 000-00-00 · 8 (900) 000-00-00 · +1 234 567 890'
