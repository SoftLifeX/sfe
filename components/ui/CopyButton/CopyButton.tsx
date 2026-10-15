'use client'
import { useEffect, useState } from 'react'
import { IconButton } from '../IconButton'
import styles from './CopyButton.module.css'

const resetDelayMs = 1800

export function CopyButton({ value, label = 'Copy' }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), resetDelayMs)
    return () => clearTimeout(timer)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
    } catch {
      // Clipboard access can be denied or unavailable on insecure origins.
    }
  }

  return (
    <IconButton
      size="sm"
      icon={copied ? 'check' : 'copy'}
      label={copied ? 'Copied' : label}
      className={copied ? styles.copied : undefined}
      onClick={copy}
    />
  )
}
