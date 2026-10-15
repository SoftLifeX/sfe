import type { ButtonHTMLAttributes } from 'react'
import { cx } from '@/lib/cx'
import { Icon, type IconName } from '../Icon'
import styles from './IconButton.module.css'

export interface IconButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'aria-label'
> {
  icon: IconName
  /** Accessible name. Icon-only buttons always need one. */
  label: string
  size?: 'sm' | 'md'
}

export function IconButton({
  icon,
  label,
  size = 'md',
  type = 'button',
  className,
  ...rest
}: IconButtonProps) {
  return (
    <button type={type} aria-label={label} className={cx(styles.button, styles[size], className)} {...rest}>
      <Icon name={icon} size={size === 'sm' ? 16 : 20} />
    </button>
  )
}
