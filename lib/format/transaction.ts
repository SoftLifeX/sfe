import type { Transaction, TransactionStatus, TransactionType } from '@/types/api'

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  deposit: 'Deposit',
  withdrawal: 'Withdrawal',
  transfer_in: 'Transfer in',
  transfer_out: 'Transfer out',
  conversion: 'Conversion',
  card_payment: 'Card payment',
  bill_payment: 'Bill payment',
}

export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
  successful: 'Successful',
  pending: 'Pending',
  failed: 'Failed',
}

const CREDIT_TYPES: readonly TransactionType[] = ['deposit', 'transfer_in', 'conversion']

export const isCredit = (type: TransactionType) => CREDIT_TYPES.includes(type)

/** "Transfer out to Kwame Mensah", or just the type label when there is no counterparty. */
export function getTransactionTitle({ type, counterparty }: Pick<Transaction, 'type' | 'counterparty'>) {
  const label = TRANSACTION_TYPE_LABELS[type]
  if (!counterparty) return label
  if (type === 'transfer_in') return `${label} from ${counterparty}`
  if (type === 'transfer_out') return `${label} to ${counterparty}`
  return label
}

/** "Okonkwo-Adeyemi Logistics" -> "OA" */
export function getInitials(name: string) {
  return name
    .split(/[\s-]+/)
    .map((word) => word.match(/\p{L}/u)?.[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const htmlTag = /<\/?[a-z][^>]*>/gi

/** Upstream narration can contain stray markup. Strip it for display; React still escapes whatever remains. */
export const cleanNarration = (narration: string) =>
  narration.replace(htmlTag, '').replace(/\s+/g, ' ').trim()
