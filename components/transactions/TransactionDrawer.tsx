import type { Transaction } from '@/types/api'
import { Button, Drawer, EmptyState } from '@/components/ui'
import { ApiError } from '@/lib/api/client'
import { TransactionDetails, TransactionDetailsSkeleton } from './TransactionDetails'

export interface TransactionDrawerProps {
  open: boolean
  transaction?: Transaction
  isLoading: boolean
  error: Error | null
  onClose: () => void
  onRetry: () => void
}

export function TransactionDrawer({
  open,
  transaction,
  isLoading,
  error,
  onClose,
  onRetry,
}: TransactionDrawerProps) {
  return (
    <Drawer open={open} title="Transaction details" onClose={onClose}>
      {transaction ? (
        <TransactionDetails transaction={transaction} />
      ) : isLoading ? (
        <TransactionDetailsSkeleton />
      ) : error instanceof ApiError && error.status === 404 ? (
        <EmptyState
          icon="search"
          motion="pop"
          title="Transaction not found"
          description="It may have been removed, or the link is wrong."
          action={
            <Button variant="secondary" onClick={onClose}>
              Back to transactions
            </Button>
          }
        />
      ) : error ? (
        <EmptyState
          icon="alert"
          tone="danger"
          motion="shake"
          role="alert"
          title="We couldn’t load this transaction"
          description="Check your connection and try again."
          action={
            <Button iconLeft="refresh" onClick={onRetry}>
              Try again
            </Button>
          }
        />
      ) : null}
    </Drawer>
  )
}
