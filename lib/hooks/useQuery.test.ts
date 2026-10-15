import { act, renderHook, waitFor } from '@testing-library/react'
import { useQuery } from './useQuery'

describe('useQuery', () => {
  it('keeps the previous data while the next key loads', async () => {
    let release: (value: string) => void = () => {}
    const fetcher = vi.fn((): Promise<string> => new Promise((resolve) => (release = resolve)))
    const { result, rerender } = renderHook(({ id }) => useQuery(id, fetcher, { keepPreviousData: true }), {
      initialProps: { id: 'a' },
    })

    expect(result.current.isLoading).toBe(true)
    act(() => release('first'))
    await waitFor(() => expect(result.current.data).toBe('first'))

    rerender({ id: 'b' })
    expect(result.current.data).toBe('first')
    expect(result.current.isFetching).toBe(true)
    expect(result.current.isLoading).toBe(false)

    act(() => release('second'))
    await waitFor(() => expect(result.current.data).toBe('second'))
  })

  it('exposes errors and refetches on demand', async () => {
    const fetcher = vi.fn().mockRejectedValueOnce(new Error('nope')).mockResolvedValueOnce('ok')
    const { result } = renderHook(() => useQuery('a', fetcher))

    await waitFor(() => expect(result.current.error?.message).toBe('nope'))
    act(() => result.current.refetch())
    await waitFor(() => expect(result.current.data).toBe('ok'))
    expect(result.current.error).toBeNull()
  })
})
