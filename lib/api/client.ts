import type { ApiErrorBody, ApiSuccess } from '@/types/api'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api'
const getRetries = 2
const retryDelayMs = 300

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export const isAbortError = (error: unknown) => error instanceof DOMException && error.name === 'AbortError'

const isTransient = (error: unknown) =>
  error instanceof ApiError && (error.status === 0 || error.status >= 500)

function sleep(ms: number, signal?: AbortSignal | null) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason)
    const timer = setTimeout(resolve, ms)
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
        reject(signal.reason)
      },
      { once: true }
    )
  })
}

async function send<T>(path: string, init: RequestInit): Promise<ApiSuccess<T>> {
  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, init)
  } catch (error) {
    if (isAbortError(error)) throw error
    throw new ApiError(0, 'NETWORK_ERROR', 'Network request failed. Check your connection and try again.')
  }

  const body: (Partial<ApiSuccess<T>> & Partial<ApiErrorBody>) | null = await res.json().catch(() => null)

  if (!res.ok) {
    throw new ApiError(
      res.status,
      body?.error?.code ?? 'UNKNOWN_ERROR',
      body?.error?.message ?? (res.statusText || 'Something went wrong')
    )
  }
  if (!body || body.data === undefined) {
    throw new ApiError(res.status, 'INVALID_RESPONSE', 'Unexpected response from the server')
  }
  return body as ApiSuccess<T>
}

async function request<T>(path: string, init: RequestInit = {}, retries = 0): Promise<ApiSuccess<T>> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await send<T>(path, init)
    } catch (error) {
      if (attempt >= retries || !isTransient(error)) throw error
      await sleep(retryDelayMs * 2 ** attempt, init.signal)
    }
  }
}

export const api = {
  /** GETs are idempotent, so transient failures (5xx, network) are retried with backoff. */
  get: <T>(path: string, init?: RequestInit) => request<T>(path, init, getRetries),
  post: <T>(path: string, body: unknown, init?: RequestInit) =>
    request<T>(path, {
      ...init,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...init?.headers },
      body: JSON.stringify(body),
    }),
}
