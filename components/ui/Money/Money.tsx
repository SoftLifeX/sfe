import type { Currency } from '@/types/api'
import { cx } from '@/lib/cx'
import { formatMoney } from '@/lib/format'
import styles from './Money.module.css'

const minus = '\u2212'

export interface MoneyProps {
  /** Minor units. */
  amount: number
  currency: Currency
  /** Prefix with + or a minus sign. */
  sign?: 'credit' | 'debit'
  className?: string
}

export function Money({ amount, currency, sign, className }: MoneyProps) {
  const prefix = sign === 'credit' ? '+' : sign === 'debit' ? minus : ''
  return (
    <span className={cx(styles.money, className)}>
      {prefix}
      {formatMoney(amount, currency)}
    </span>
  )
}
