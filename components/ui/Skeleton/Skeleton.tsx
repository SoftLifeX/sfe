import type { CSSProperties } from 'react'
import { cx } from '@/lib/cx'
import styles from './Skeleton.module.css'

export interface SkeletonProps {
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  className?: string
}

/** Decorative placeholder. Give the surrounding region an accessible loading label. */
export function Skeleton({ width = '100%', height = 12, className }: SkeletonProps) {
  return <span aria-hidden className={cx(styles.skeleton, className)} style={{ width, height }} />
}
