import { useEffect, useState } from 'react'
import { Button, Input, Select } from '@/components/ui'
import { TRANSACTION_STATUS_LABELS, TRANSACTION_TYPE_LABELS } from '@/lib/format'
import type { FilterChanges, TransactionFilters } from '@/lib/transactions/filters'
import type { TransactionStatus, TransactionType } from '@/types/api'
import styles from './TransactionFilterBar.module.css'

const searchDebounceMs = 300

const toOptions = (allLabel: string, labels: Record<string, string>) => [
  { value: '', label: allLabel },
  ...Object.entries(labels).map(([value, label]) => ({ value, label })),
]

const typeOptions = toOptions('All types', TRANSACTION_TYPE_LABELS)
const statusOptions = toOptions('All statuses', TRANSACTION_STATUS_LABELS)

export interface TransactionFilterBarProps {
  filters: TransactionFilters
  isSearching: boolean
  onChange: (changes: FilterChanges, mode?: 'push' | 'replace') => void
  onClear: () => void
}

export function TransactionFilterBar({ filters, isSearching, onChange, onClear }: TransactionFilterBarProps) {
  const [text, setText] = useState(filters.q)
  // The last query this bar pushed to the URL. A URL change that matches it is our own echo and must not
  // overwrite what the user has typed since.
  const [committed, setCommitted] = useState(filters.q)
  const [seenQuery, setSeenQuery] = useState(filters.q)

  if (filters.q !== seenQuery) {
    setSeenQuery(filters.q)
    if (filters.q !== committed) {
      setCommitted(filters.q)
      setText(filters.q)
    }
  }

  const commit = (value: string) => {
    setCommitted(value)
    onChange({ q: value }, 'replace')
  }

  useEffect(() => {
    const value = text.trim()
    if (value === committed) return
    const timer = setTimeout(() => {
      setCommitted(value)
      onChange({ q: value }, 'replace')
    }, searchDebounceMs)
    return () => clearTimeout(timer)
  }, [text, committed, onChange])

  const canClear = text.trim() !== '' || Boolean(filters.q || filters.type || filters.status)

  return (
    <div role="search" className={styles.bar}>
      <Input
        label="Search"
        leadingIcon="search"
        busy={isSearching}
        type="text"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        placeholder="Search by reference, name or narration"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && text.trim() !== committed) commit(text.trim())
        }}
        fieldClassName={styles.search}
      />
      <Select
        label="Type"
        options={typeOptions}
        value={filters.type ?? ''}
        onChange={(value) => onChange({ type: (value as TransactionType) || undefined })}
      />
      <Select
        label="Status"
        options={statusOptions}
        value={filters.status ?? ''}
        onChange={(value) => onChange({ status: (value as TransactionStatus) || undefined })}
      />
      {canClear && (
        <Button
          variant="ghost"
          className={styles.clear}
          onClick={() => {
            setText('')
            setCommitted('')
            onClear()
          }}
        >
          Clear filters
        </Button>
      )}
    </div>
  )
}
