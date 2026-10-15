import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'
import { Icon, type IconName } from '../Icon'
import styles from './EmptyState.module.css'

export interface EmptyStateProps {
  icon: IconName
  title: string
  description?: string
  tone?: 'primary' | 'danger'
  /** Entrance animation for the icon. */
  motion?: 'shake' | 'pop' | 'float'
  action?: ReactNode
  role?: 'status' | 'alert'
}

export function EmptyState({
  icon,
  title,
  description,
  tone = 'primary',
  motion,
  action,
  role,
}: EmptyStateProps) {
  return (
    <div className={styles.state} role={role}>
      <span className={cx(styles.icon, styles[tone], motion && styles[motion])}>
        <Icon name={icon} size={24} />
      </span>
      <p className={styles.title}>{title}</p>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  )
}
