import { useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cx } from '@/lib/cx'
import { Field, getDescriptionId } from '../Field'
import { Icon, type IconName } from '../Icon'
import styles from './Input.module.css'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string
  hideLabel?: boolean
  hint?: ReactNode
  error?: string
  leadingIcon?: IconName
  /** Pulses the leading icon while something is happening, e.g. a search in flight. */
  busy?: boolean
  fieldClassName?: string
}

export function Input({
  label,
  hideLabel,
  hint,
  error,
  leadingIcon,
  busy,
  fieldClassName,
  className,
  id,
  ...rest
}: InputProps) {
  const generatedId = useId()
  const controlId = id ?? generatedId
  const describedBy = error
    ? getDescriptionId(controlId, 'error')
    : hint
      ? getDescriptionId(controlId, 'hint')
      : undefined

  return (
    <Field
      id={controlId}
      label={label}
      hideLabel={hideLabel}
      hint={hint}
      error={error}
      className={fieldClassName}
    >
      <div className={styles.control}>
        {leadingIcon && (
          <Icon name={leadingIcon} size={16} className={cx(styles.icon, busy && styles.busy)} />
        )}
        <input
          id={controlId}
          className={cx(styles.input, leadingIcon && styles.withIcon, error && styles.invalid, className)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...rest}
        />
      </div>
    </Field>
  )
}
