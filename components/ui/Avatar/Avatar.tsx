import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'
import styles from './Avatar.module.css'

export interface AvatarProps {
  src: string | null
  alt: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  /** Shown instead of an image when there is no `src`, e.g. initials or an icon. */
  children?: ReactNode
}

export function Avatar({ src, alt, size = 'md', className, children }: AvatarProps) {
  if (!src) {
    return (
      <span
        className={cx(styles.avatar, styles.fallback, styles[size], className)}
        role={alt ? 'img' : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
      >
        {children}
      </span>
    )
  }
  // eslint-disable-next-line @next/next/no-img-element -- avatars come from arbitrary CDNs
  return <img src={src} alt={alt} className={cx(styles.avatar, styles[size], className)} />
}
