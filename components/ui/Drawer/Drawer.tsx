'use client'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { IconButton } from '../IconButton'
import styles from './Drawer.module.css'

/** Keep in sync with --duration-normal. */
const exitDurationMs = 200

export interface DrawerProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}

/** Side panel on desktop, bottom sheet on mobile. Built on <dialog> for focus trapping, Escape and inert background. */
export function Drawer({ open, title, onClose, children, footer }: DrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  // Freeze the content while open so it does not blank out during the exit animation.
  const [content, setContent] = useState({ children, footer })
  if (open && (content.children !== children || content.footer !== footer)) {
    setContent({ children, footer })
  }

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open) {
      if (!dialog.open) dialog.showModal()
      return
    }
    const timer = setTimeout(() => dialog.close(), exitDurationMs)
    return () => clearTimeout(timer)
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className={styles.drawer}
      data-state={open ? 'open' : 'closed'}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className={styles.panel}>
        <span className={styles.handle} aria-hidden />
        <header className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <IconButton icon="close" label="Close" onClick={onClose} />
        </header>
        <div className={styles.body}>{content.children}</div>
        {content.footer && <footer className={styles.footer}>{content.footer}</footer>}
      </div>
    </dialog>
  )
}
