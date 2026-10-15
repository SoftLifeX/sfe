import { formatDayLabel, getDayKey } from '@/lib/format'
import type { Transaction } from '@/types/api'

export interface TransactionGroup {
  key: string
  label: string
  items: Transaction[]
}

/** Groups a newest-first list into consecutive calendar days. */
export function groupByDay(transactions: Transaction[], now = new Date()): TransactionGroup[] {
  const groups: TransactionGroup[] = []
  for (const tx of transactions) {
    const key = getDayKey(tx.createdAt)
    const last = groups[groups.length - 1]
    if (last?.key === key) last.items.push(tx)
    else groups.push({ key, label: formatDayLabel(tx.createdAt, now), items: [tx] })
  }
  return groups
}
