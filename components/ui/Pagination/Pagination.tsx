import { cx } from '@/lib/cx'
import { Button } from '../Button'
import { getPageItems } from './getPageItems'
import styles from './Pagination.module.css'

export interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

/** Numbered pages on wide screens, "Page x of y" on narrow ones. */
export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  return (
    <nav aria-label="Pagination" className={cx(styles.nav, className)}>
      <Button
        variant="secondary"
        size="sm"
        iconLeft="chevron-left"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <span className={styles.full}>Previous</span>
        <span className={styles.short}>Prev</span>
      </Button>

      <ol className={styles.pages}>
        {getPageItems(page, totalPages).map((item, index) =>
          item === 'ellipsis' ? (
            <li key={`gap-${index}`} className={styles.ellipsis} aria-hidden>
              {'\u2026'}
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                className={cx(styles.page, item === page && styles.current)}
                aria-label={`Page ${item}`}
                aria-current={item === page ? 'page' : undefined}
                onClick={() => onPageChange(item)}
              >
                {item}
              </button>
            </li>
          )
        )}
      </ol>

      <p className={styles.status}>
        Page {page} of {totalPages}
      </p>

      <Button
        variant="secondary"
        size="sm"
        iconRight="chevron-right"
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </nav>
  )
}
