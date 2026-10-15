import type { Metadata } from 'next'
import { Suspense } from 'react'
import { TransactionsView } from '@/components/transactions'
import { TransactionListSkeleton } from '@/components/transactions/TransactionListSkeleton'

export const metadata: Metadata = { title: 'Transactions' }

export default function TransactionsPage() {
  return (
    <Suspense fallback={<TransactionListSkeleton />}>
      <TransactionsView />
    </Suspense>
  )
}
