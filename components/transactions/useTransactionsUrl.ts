import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo, useRef } from 'react'
import { parseFilters, type FilterChanges } from '@/lib/transactions/filters'

type NavigationMode = 'push' | 'replace'

const filterKeys = ['q', 'type', 'status', 'page']

/**
 * The URL is the source of truth for filters, page and the open transaction, so refresh, shared links and
 * Back/Forward all restore the same view. Unknown params (such as `__scenario`) are always preserved.
 */
export function useTransactionsUrl() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const openedInApp = useRef(false)

  const filters = useMemo(() => parseFilters(searchParams), [searchParams])
  const selectedId = searchParams.get('tx')

  const navigate = useCallback(
    (mutate: (params: URLSearchParams) => void, mode: NavigationMode = 'push') => {
      const next = new URLSearchParams(searchParams.toString())
      mutate(next)
      const query = next.toString()
      router[mode](query ? `${pathname}?${query}` : pathname, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  const setFilters = useCallback(
    (changes: FilterChanges, mode?: NavigationMode) =>
      navigate((params) => {
        for (const [key, value] of Object.entries(changes)) {
          if (value) params.set(key, value)
          else params.delete(key)
        }
        params.delete('page')
      }, mode),
    [navigate]
  )

  const clearFilters = useCallback(
    () => navigate((params) => filterKeys.forEach((key) => params.delete(key))),
    [navigate]
  )

  const setPage = useCallback(
    (page: number, mode?: NavigationMode) =>
      navigate((params) => (page > 1 ? params.set('page', String(page)) : params.delete('page')), mode),
    [navigate]
  )

  const openTransaction = useCallback(
    (id: string) => {
      openedInApp.current = true
      navigate((params) => params.set('tx', id))
    },
    [navigate]
  )

  /** Goes back when the drawer was opened from the list, so history does not fill up with open/close pairs. */
  const closeTransaction = useCallback(() => {
    if (openedInApp.current) {
      openedInApp.current = false
      router.back()
    } else {
      navigate((params) => params.delete('tx'), 'replace')
    }
  }, [navigate, router])

  return { filters, selectedId, setFilters, clearFilters, setPage, openTransaction, closeTransaction }
}
