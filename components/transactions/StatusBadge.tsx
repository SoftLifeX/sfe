import type { TransactionStatus } from '@/types/api'
import { Badge, type BadgeTone } from '@/components/ui'
import { TRANSACTION_STATUS_LABELS } from '@/lib/format'
import styles from './StatusBadge.module.css'

const tones: Record<TransactionStatus, BadgeTone> = {
  successful: 'success',
  pending: 'warning',
  failed: 'danger',
}

export function StatusBadge({ status }: { status: TransactionStatus }) {
  return (
    <Badge
      tone={tones[status]}
      dot
      pulse={status === 'pending'}
      className={status === 'failed' ? styles.failed : undefined}
    >
      {TRANSACTION_STATUS_LABELS[status]}
    </Badge>
  )
}
