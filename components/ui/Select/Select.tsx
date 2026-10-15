'use client'
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { cx } from '@/lib/cx'
import { Field } from '../Field'
import { Icon } from '../Icon'
import styles from './Select.module.css'

const typeaheadResetMs = 500

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps {
  label: string
  hideLabel?: boolean
  options: readonly SelectOption[]
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  id?: string
  fieldClassName?: string
  className?: string
}

/** Accessible select-only combobox: keyboard navigation, typeahead, and an animated popover. */
export function Select({
  label,
  hideLabel,
  options,
  value,
  onChange,
  disabled,
  id,
  fieldClassName,
  className,
}: SelectProps) {
  const generatedId = useId()
  const controlId = id ?? generatedId
  const listId = `${controlId}-list`
  const optionId = (index: number) => `${controlId}-option-${index}`

  const rootRef = useRef<HTMLDivElement>(null)
  const typeahead = useRef({ text: '', timer: 0 })
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value)
  )
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(selectedIndex)

  useEffect(() => {
    if (!open) return
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsidePress)
    return () => document.removeEventListener('pointerdown', closeOnOutsidePress)
  }, [open])

  useEffect(() => {
    if (open)
      document.getElementById(`${controlId}-option-${activeIndex}`)?.scrollIntoView({ block: 'nearest' })
  }, [open, activeIndex, controlId])

  const openList = () => {
    setActiveIndex(selectedIndex)
    setOpen(true)
  }

  const select = (index: number) => {
    onChange(options[index].value)
    setOpen(false)
  }

  const move = (delta: number) => setActiveIndex((index) => (index + delta + options.length) % options.length)

  const findByTyping = (char: string) => {
    const state = typeahead.current
    window.clearTimeout(state.timer)
    state.text += char.toLowerCase()
    state.timer = window.setTimeout(() => (state.text = ''), typeaheadResetMs)
    const match = options.findIndex((option) => option.label.toLowerCase().startsWith(state.text))
    if (match < 0) return
    setOpen(true)
    setActiveIndex(match)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault()
        if (open) move(event.key === 'ArrowDown' ? 1 : -1)
        else openList()
        break
      case 'Home':
      case 'End':
        if (!open) break
        event.preventDefault()
        setActiveIndex(event.key === 'Home' ? 0 : options.length - 1)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (open) select(activeIndex)
        else openList()
        break
      case 'Escape':
        if (open) {
          event.preventDefault()
          setOpen(false)
        }
        break
      case 'Tab':
        setOpen(false)
        break
      default:
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          findByTyping(event.key)
        }
    }
  }

  return (
    <Field id={controlId} label={label} hideLabel={hideLabel} className={fieldClassName}>
      <div ref={rootRef} className={styles.control}>
        <button
          id={controlId}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={open ? optionId(activeIndex) : undefined}
          disabled={disabled}
          className={cx(styles.trigger, open && styles.triggerOpen, className)}
          onClick={() => (open ? setOpen(false) : openList())}
          onKeyDown={handleKeyDown}
        >
          <span className={styles.value}>{options[selectedIndex]?.label}</span>
          <Icon name="chevron-down" size={16} className={cx(styles.chevron, open && styles.chevronOpen)} />
        </button>

        {/* Keeps focus on the trigger while the pointer interacts with the list. */}
        <ul
          id={listId}
          role="listbox"
          aria-label={label}
          className={cx(styles.list, open && styles.listOpen)}
          onMouseDown={(event) => event.preventDefault()}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={optionId(index)}
              role="option"
              aria-selected={index === selectedIndex}
              className={cx(
                styles.option,
                index === activeIndex && styles.optionActive,
                index === selectedIndex && styles.optionSelected
              )}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => select(index)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    </Field>
  )
}
