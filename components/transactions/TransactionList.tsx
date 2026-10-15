import type { Transaction } from '@/types/api'
import { Button, Card, EmptyState } from '@/components/ui'
import { cx } from '@/lib/cx'
import { groupByDay } from '@/lib/transactions/group'
import { TransactionListSkeleton } from './TransactionListSkeleton'
import { TransactionRow } from './TransactionRow'
import styles from './TransactionList.module.css'

export interface TransactionListProps {
  transactions?: Transaction[]
  isLoading: boolean
  /** A newer result is on its way; the current rows are kept on screen, dimmed. */
  isFetching: boolean
  error: Error | null
  hasFilters: boolean
  onRetry: () => void
  onClearFilters: () => void
  onSelect: (transaction: Transaction) => void
}

export function TransactionList({
  transactions,
  isLoading,
  isFetching,
  error,
  hasFilters,
  onRetry,
  onClearFilters,
  onSelect,
}: TransactionListProps) {
  if (isLoading) return <TransactionListSkeleton />

  if (error) {
    return (
      <Card padding="none">
        <EmptyState
          icon="alert"
          tone="danger"
          motion="shake"
          role="alert"
          title="We couldn’t load your transactions"
          description="Check your connection and try again."
          action={
            <Button iconLeft="refresh" className={styles.retry} onClick={onRetry}>
              Try again
            </Button>
          }
        />
      </Card>
    )
  }

  if (!transactions?.length) {
    return (
      <Card padding="none">
        {hasFilters ? (
          <EmptyState
            icon="search"
            motion="pop"
            role="status"
            title="No transactions match your filters"
            description="Try a different search term or remove some filters."
            action={
              <Button variant="secondary" onClick={onClearFilters}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <EmptyState
            icon="inbox"
            motion="float"
            role="status"
            title="No transactions yet"
            description="When you add money, send a transfer or pay with your card, it will show up here."
          />
        )}
      </Card>
    )
  }

  return (
    <div className={cx(styles.results, isFetching && styles.stale)} aria-busy={isFetching}>
      <Card padding="none" as="div">
        <div key={transactions[0].id} className={styles.groups}>
          {groupByDay(transactions).map((group) => (
            <section key={group.key} className={styles.group}>
              <h2 className={styles.groupTitle}>{group.label}</h2>
              {group.items.map((tx) => (
                <TransactionRow key={tx.id} transaction={tx} timeOnly onSelect={onSelect} />
              ))}
            </section>
          ))}
        </div>
      </Card>
    </div>
  )
}
