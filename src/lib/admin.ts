import { getSession, type SessionPayload } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function requireAdmin(): Promise<SessionPayload | null> {
  const session = await getSession()
  if (!session) return null

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { role: true },
  })
  if (!user || user.role !== 'ADMIN') return null
  return session
}
