import { useCallback, useEffect, useRef, useState } from 'react'

interface Settled<T> {
  key: string
  data?: T
  error?: Error
}

export interface QueryResult<T> {
  data: T | undefined
  error: Error | null
  /** Fetching with nothing to show yet. */
  isLoading: boolean
  isFetching: boolean
  refetch: () => void
}

/**
 * Fetches whenever `key` changes and aborts the superseded request. A `null` key disables the query.
 * With `keepPreviousData`, the last successful result stays visible while the next one loads.
 */
export function useQuery<T>(
  key: string | null,
  fetcher: (signal: AbortSignal) => Promise<T>,
  { keepPreviousData = false } = {}
): QueryResult<T> {
  const [attempt, setAttempt] = useState(0)
  const [settled, setSettled] = useState<Settled<T>>()
  const fetcherRef = useRef(fetcher)
  const requestKey = key === null ? null : `${key}#${attempt}`

  useEffect(() => {
    fetcherRef.current = fetcher
  })

  useEffect(() => {
    if (requestKey === null) return
    const controller = new AbortController()
    fetcherRef.current(controller.signal).then(
      (data) => {
        if (!controller.signal.aborted) setSettled({ key: requestKey, data })
      },
      (error: unknown) => {
        if (controller.signal.aborted) return
        setSettled({ key: requestKey, error: error instanceof Error ? error : new Error(String(error)) })
      }
    )
    return () => controller.abort()
  }, [requestKey])

  const refetch = useCallback(() => setAttempt((n) => n + 1), [])

  const isCurrent = settled?.key === requestKey
  const data = isCurrent || keepPreviousData ? settled?.data : undefined
  const isFetching = requestKey !== null && !isCurrent

  return {
    data,
    error: isCurrent ? (settled?.error ?? null) : null,
    isLoading: isFetching && data === undefined,
    isFetching,
    refetch,
  }
}
