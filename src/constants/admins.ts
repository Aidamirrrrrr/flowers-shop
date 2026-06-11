/** Telegram usernames (without @) with доступом к /admin */
export const ADMIN_USERNAMES = new Set(['aidamirrrrrr', 'demo_flowers'])

export function roleForUsername(username: string | undefined | null): 'ADMIN' | 'USER' {
  const normalized = username?.toLowerCase().replace(/^@/, '') ?? ''
  return ADMIN_USERNAMES.has(normalized) ? 'ADMIN' : 'USER'
}
