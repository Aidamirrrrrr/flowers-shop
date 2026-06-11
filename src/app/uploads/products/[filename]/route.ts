import { readFile } from 'fs/promises'
import { NextResponse } from 'next/server'
import { contentTypeForFilename, getUploadsDir } from '@/lib/uploads'
import path from 'path'

type RouteContext = { params: Promise<{ filename: string }> }

export async function GET(_request: Request, context: RouteContext) {
  const { filename } = await context.params

  if (!filename || filename.includes('..') || filename.includes('/')) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const filePath = path.join(getUploadsDir(), filename)

  try {
    const buffer = await readFile(filePath)
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentTypeForFilename(filename),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}

export const dynamic = 'force-dynamic'
