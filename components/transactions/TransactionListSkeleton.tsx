import { Card, Skeleton } from '@/components/ui'
import styles from './TransactionListSkeleton.module.css'

const rowCount = 6

export function TransactionListSkeleton() {
  return (
    <div role="status" aria-label="Loading transactions">
      <Card padding="none" as="div">
        <div className={styles.header}>
          <Skeleton width={56} height={10} />
        </div>
        {Array.from({ length: rowCount }, (_, i) => (
          <div key={i} className={styles.row}>
            <Skeleton width={40} height={40} />
            <div className={styles.column}>
              <Skeleton width={120} height={10} />
              <Skeleton width={260} height={8} />
            </div>
            <div className={styles.end}>
              <Skeleton width={96} height={10} />
              <Skeleton width={40} height={8} />
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}
