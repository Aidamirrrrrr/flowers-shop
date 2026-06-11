export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { credentials: 'include', ...init })
  const data = (await res.json().catch(() => ({}))) as T & { error?: string }

  if (!res.ok) {
    throw new ApiError(res.status, data.error ?? 'Ошибка запроса')
  }

  return data
}
