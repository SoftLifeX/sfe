import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'
import styles from './Badge.module.css'

export type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger'

export interface BadgeProps {
  children: ReactNode
  tone?: BadgeTone
  /** Show a leading dot. */
  dot?: boolean
  /** Pulse the dot to signal something in progress. */
  pulse?: boolean
  className?: string
}

export function Badge({ children, tone = 'neutral', dot = false, pulse = false, className }: BadgeProps) {
  return (
    <span className={cx(styles.badge, styles[tone], className)}>
      {dot && <span className={cx(styles.dot, pulse && styles.pulse)} aria-hidden />}
      {children}
    </span>
  )
}
