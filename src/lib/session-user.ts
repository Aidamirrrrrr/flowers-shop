import type { SessionUser } from '@/hooks/queries/use-session-query'

export function toSessionUser(user: {
  id: string
  role: string
  firstName: string | null
  lastName: string | null
  username: string | null
}): SessionUser {
  return {
    id: user.id,
    role: user.role,
    isAdmin: user.role === 'ADMIN',
    displayName:
      [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Пользователь',
    username: user.username,
  }
}
