import type { Transaction, TransactionType } from '@/types/api'
import { Avatar, Icon, type IconName } from '@/components/ui'
import { getInitials } from '@/lib/format'

const TYPE_ICONS: Record<TransactionType, IconName> = {
  deposit: 'arrow-down-left',
  transfer_in: 'arrow-down-left',
  withdrawal: 'arrow-up-right',
  transfer_out: 'arrow-up-right',
  conversion: 'swap',
  card_payment: 'card',
  bill_payment: 'receipt',
}

/** Counterparty initials when there is one, otherwise an icon for the transaction type. */
export function TransactionIcon({
  transaction,
  size = 'md',
}: {
  transaction: Pick<Transaction, 'type' | 'counterparty'>
  size?: 'md' | 'lg'
}) {
  const initials = transaction.counterparty ? getInitials(transaction.counterparty) : ''
  return (
    <Avatar src={null} alt="" size={size}>
      {initials || <Icon name={TYPE_ICONS[transaction.type]} size={size === 'lg' ? 20 : 18} />}
    </Avatar>
  )
}
