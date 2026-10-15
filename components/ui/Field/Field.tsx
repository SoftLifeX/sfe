import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'
import styles from './Field.module.css'

export interface FieldProps {
  /** Id of the control this field labels. Hint and error ids derive from it. */
  id: string
  label: string
  hint?: ReactNode
  error?: string
  /** Visually hide the label (it is still rendered). */
  hideLabel?: boolean
  className?: string
  children: ReactNode
}

export const getDescriptionId = (id: string, kind: 'hint' | 'error') => `${id}-${kind}`

/** Label + control + hint/error. Used by Input and Select. */
export function Field({ id, label, hint, error, hideLabel, className, children }: FieldProps) {
  return (
    <div className={cx(styles.field, className)}>
      <label htmlFor={id} className={cx(styles.label, hideLabel && 'visually-hidden')}>
        {label}
      </label>
      {children}
      {error ? (
        <p id={getDescriptionId(id, 'error')} className={styles.error}>
          {error}
        </p>
      ) : hint ? (
        <p id={getDescriptionId(id, 'hint')} className={styles.hint}>
          {hint}
        </p>
      ) : null}
    </div>
  )
}
