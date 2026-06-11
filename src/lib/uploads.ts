import { mkdir, unlink, writeFile } from 'fs/promises'
import path from 'path'

export const UPLOADS_PUBLIC_PREFIX = '/uploads/products'

/** Railway: volume на /app → по умолчанию /app/public/uploads/products */
function getUploadsDir() {
  if (process.env.UPLOADS_DIR) {
    return path.resolve(process.env.UPLOADS_DIR)
  }
  return path.join(process.cwd(), 'public', 'uploads', 'products')
}

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const MAX_BYTES = 5 * 1024 * 1024

const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
}

export function isLocalUploadUrl(url: string): boolean {
  return url.startsWith(`${UPLOADS_PUBLIC_PREFIX}/`)
}

export function localUploadAbsolutePath(publicUrl: string): string | null {
  if (!isLocalUploadUrl(publicUrl)) return null
  const filename = path.basename(publicUrl)
  if (!filename || filename.includes('..')) return null
  return path.join(getUploadsDir(), filename)
}

export async function ensureUploadsDir() {
  await mkdir(getUploadsDir(), { recursive: true })
}

export async function saveProductImage(file: File): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error('Допустимы JPG, PNG, WebP или GIF')
  }
  if (file.size > MAX_BYTES) {
    throw new Error('Файл больше 5 МБ')
  }

  const ext = EXT_BY_MIME[file.type] ?? '.jpg'
  const filename = `${crypto.randomUUID()}${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  await ensureUploadsDir()
  await writeFile(path.join(getUploadsDir(), filename), buffer)

  return `${UPLOADS_PUBLIC_PREFIX}/${filename}`
}

export async function deleteLocalUpload(publicUrl: string | null | undefined) {
  const absolute = publicUrl ? localUploadAbsolutePath(publicUrl) : null
  if (!absolute) return
  try {
    await unlink(absolute)
  } catch {
    // file may already be gone
  }
}
