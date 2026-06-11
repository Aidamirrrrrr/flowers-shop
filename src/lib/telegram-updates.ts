type TelegramMessage = {
  message_id: number
  chat: { id: number; type: string }
  text?: string
}

export type TelegramUpdate = {
  update_id: number
  message?: TelegramMessage
}

export function isStartCommand(text: string | undefined): boolean {
  if (!text) return false
  const command = text.trim().split(/\s+/)[0]?.toLowerCase()
  return command === '/start' || command.startsWith('/start@')
}
