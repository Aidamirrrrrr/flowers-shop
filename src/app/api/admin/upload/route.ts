import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { saveProductImage } from '@/lib/uploads'

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Файл не передан' }, { status: 400 })
    }

    const url = await saveProductImage(file)
    return NextResponse.json({ url })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Не удалось загрузить файл'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
