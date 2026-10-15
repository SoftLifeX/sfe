import type { Transaction } from '@/types/api'
import { Money } from '@/components/ui'
import { cx } from '@/lib/cx'
import { cleanNarration, formatDateTime, formatTime, isCredit, TRANSACTION_TYPE_LABELS } from '@/lib/format'
import { StatusBadge } from './StatusBadge'
import { TransactionIcon } from './TransactionIcon'
import styles from './TransactionRow.module.css'

export interface TransactionRowProps {
  transaction: Transaction
  onSelect?: (transaction: Transaction) => void
  /** Show only the time, for lists already grouped under a date heading. */
  timeOnly?: boolean
}

export function TransactionRow({ transaction: tx, onSelect, timeOnly = false }: TransactionRowProps) {
  const credit = isCredit(tx.type)
  const narration = cleanNarration(tx.narration)

  return (
    <button type="button" className={styles.row} onClick={() => onSelect?.(tx)}>
      <TransactionIcon transaction={tx} />
      <span className={styles.main}>
        <span className={styles.title}>{TRANSACTION_TYPE_LABELS[tx.type]}</span>
        <span className={styles.narration} title={narration}>
          {narration}
        </span>
      </span>
      <span className={styles.status}>
        <StatusBadge status={tx.status} />
      </span>
      <span className={styles.end}>
        <Money
          amount={tx.amount}
          currency={tx.currency}
          sign={credit ? 'credit' : 'debit'}
          className={credit ? styles.credit : styles.amount}
        />
        <span className={cx(styles.meta, timeOnly && styles.timeOnly)}>
          {timeOnly ? formatTime(tx.createdAt) : formatDateTime(tx.createdAt)}
        </span>
      </span>
    </button>
  )
}
