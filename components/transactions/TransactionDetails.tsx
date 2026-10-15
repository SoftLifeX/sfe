import type { ReactNode } from 'react'
import type { Transaction } from '@/types/api'
import { CopyButton, Money, Skeleton } from '@/components/ui'
import { cx } from '@/lib/cx'
import {
  cleanNarration,
  formatDateTime,
  getTransactionTitle,
  isCredit,
  TRANSACTION_TYPE_LABELS,
} from '@/lib/format'
import { StatusBadge } from './StatusBadge'
import { TransactionIcon } from './TransactionIcon'
import styles from './TransactionDetails.module.css'

function Row({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={cx(styles.row, className)}>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}

export function TransactionDetails({ transaction: tx }: { transaction: Transaction }) {
  return (
    <div className={styles.details}>
      <header className={styles.hero}>
        <TransactionIcon transaction={tx} size="lg" />
        <p className={styles.title}>{getTransactionTitle(tx)}</p>
        <p className={styles.amount}>
          <Money amount={tx.amount} currency={tx.currency} sign={isCredit(tx.type) ? 'credit' : 'debit'} />
        </p>
        <StatusBadge status={tx.status} />
      </header>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Details</h3>
        <dl className={styles.list}>
          <Row label="Reference">
            <span className={styles.reference}>
              <span className={styles.mono}>{tx.reference}</span>
              <CopyButton value={tx.reference} label="Copy reference" />
            </span>
          </Row>
          <Row label="Date">{formatDateTime(tx.createdAt)}</Row>
          <Row label="Type">{TRANSACTION_TYPE_LABELS[tx.type]}</Row>
          {tx.counterparty && <Row label="Counterparty">{tx.counterparty}</Row>}
          <Row label="Narration">{cleanNarration(tx.narration)}</Row>
        </dl>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Summary</h3>
        <dl className={styles.list}>
          <Row label="Amount">
            <Money amount={tx.amount} currency={tx.currency} />
          </Row>
          <Row label="Fee">
            <Money amount={tx.fee} currency={tx.currency} />
          </Row>
          <Row label="Total" className={styles.total}>
            <Money amount={tx.amount + tx.fee} currency={tx.currency} />
          </Row>
        </dl>
      </section>
    </div>
  )
}

export function TransactionDetailsSkeleton() {
  return (
    <div className={styles.details} role="status" aria-label="Loading transaction">
      <div className={styles.hero}>
        <Skeleton width={48} height={48} />
        <Skeleton width={160} height={12} />
        <Skeleton width={200} height={24} />
        <Skeleton width={80} height={20} />
      </div>
      <div className={styles.list}>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className={styles.row}>
            <Skeleton width={80} height={12} />
            <Skeleton width={140} height={12} />
          </div>
        ))}
      </div>
    </div>
  )
}
