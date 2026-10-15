'use client'
import { useEffect } from 'react'
import { Pagination } from '@/components/ui'
import { getTransaction, getTransactions } from '@/lib/api/endpoints'
import { useQuery } from '@/lib/hooks/useQuery'
import { hasActiveFilters, pageSize } from '@/lib/transactions/filters'
import { TransactionDrawer } from './TransactionDrawer'
import { TransactionFilterBar } from './TransactionFilterBar'
import { TransactionList } from './TransactionList'
import { useTransactionsUrl } from './useTransactionsUrl'
import styles from './TransactionsView.module.css'

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`

export function TransactionsView() {
  const { filters, selectedId, setFilters, clearFilters, setPage, openTransaction, closeTransaction } =
    useTransactionsUrl()
  const hasFilters = hasActiveFilters(filters)

  const list = useQuery(
    ['transactions', filters.q, filters.type, filters.status, filters.page].join('|'),
    (signal) =>
      getTransactions(
        { page: filters.page, limit: pageSize, q: filters.q, type: filters.type, status: filters.status },
        { signal }
      ),
    { keepPreviousData: true }
  )
  const transactions = list.data?.data
  const meta = list.data?.meta

  // Opening a row uses the list copy. Opening a shared link falls back to fetching that one transaction.
  const selected = transactions?.find((tx) => tx.id === selectedId)
  const detailId = selected ? null : selectedId
  const detail = useQuery(detailId && `transaction|${detailId}`, (signal) =>
    getTransaction(detailId ?? '', { signal })
  )

  useEffect(() => {
    if (meta && meta.page === filters.page && meta.total > 0 && filters.page > meta.totalPages) {
      setPage(meta.totalPages, 'replace')
    }
  }, [meta, filters.page, setPage])

  const subtitle = meta
    ? hasFilters
      ? plural(meta.total, 'result', 'results')
      : plural(meta.total, 'transaction', 'transactions')
    : ''

  return (
    <div className={styles.page}>
      <header>
        <h1 className={styles.title}>Transactions</h1>
        <p className={styles.subtitle} aria-live="polite">
          {subtitle}
        </p>
      </header>

      <TransactionFilterBar
        filters={filters}
        isSearching={list.isFetching && filters.q !== ''}
        onChange={setFilters}
        onClear={clearFilters}
      />

      <TransactionList
        transactions={transactions}
        isLoading={list.isLoading}
        isFetching={list.isFetching}
        error={list.error}
        hasFilters={hasFilters}
        onRetry={list.refetch}
        onClearFilters={clearFilters}
        onSelect={(tx) => openTransaction(tx.id)}
      />

      {meta && meta.total > 0 && (
        <footer className={styles.footer}>
          <p className={styles.range}>
            {`Showing ${(meta.page - 1) * meta.limit + 1}\u2013${Math.min(meta.page * meta.limit, meta.total)} of ${meta.total}`}
          </p>
          {meta.totalPages > 1 && (
            <Pagination
              page={meta.page}
              totalPages={meta.totalPages}
              onPageChange={(page) => {
                setPage(page)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />
          )}
        </footer>
      )}

      <TransactionDrawer
        open={selectedId !== null}
        transaction={selected ?? detail.data?.data}
        isLoading={!selected && detail.isLoading}
        error={selected ? null : detail.error}
        onClose={closeTransaction}
        onRetry={detail.refetch}
      />
    </div>
  )
}
