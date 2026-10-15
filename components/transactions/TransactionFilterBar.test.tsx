import { act, fireEvent, render, screen } from '@testing-library/react'
import type { TransactionFilters } from '@/lib/transactions/filters'
import { TransactionFilterBar } from './TransactionFilterBar'

const filters = (overrides: Partial<TransactionFilters> = {}): TransactionFilters => ({
  q: '',
  page: 1,
  ...overrides,
})

const setup = (initial = filters()) => {
  const onChange = vi.fn()
  const onClear = vi.fn()
  const view = render(
    <TransactionFilterBar filters={initial} isSearching={false} onChange={onChange} onClear={onClear} />
  )
  const rerender = (next: TransactionFilters) =>
    view.rerender(
      <TransactionFilterBar filters={next} isSearching={false} onChange={onChange} onClear={onClear} />
    )
  return { onChange, onClear, rerender }
}

const search = () => screen.getByLabelText('Search')

describe('TransactionFilterBar', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('debounces typing into a single replace navigation', () => {
    const { onChange } = setup()
    fireEvent.change(search(), { target: { value: 'ne' } })
    act(() => vi.advanceTimersByTime(200))
    fireEvent.change(search(), { target: { value: 'netflix' } })
    act(() => vi.advanceTimersByTime(300))

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith({ q: 'netflix' }, 'replace')
  })

  it('does not overwrite newer typing when its own URL update comes back', () => {
    const { rerender } = setup()
    fireEvent.change(search(), { target: { value: 'net' } })
    act(() => vi.advanceTimersByTime(300))
    fireEvent.change(search(), { target: { value: 'netf' } })

    rerender(filters({ q: 'net' }))

    expect(search()).toHaveValue('netf')
  })

  it('follows external URL changes such as Back', () => {
    const { rerender } = setup(filters({ q: 'netflix' }))
    rerender(filters({ q: '' }))
    expect(search()).toHaveValue('')
  })

  it('only offers Clear filters when something is set, and clears the text', () => {
    const { onClear } = setup()
    expect(screen.queryByRole('button', { name: 'Clear filters' })).not.toBeInTheDocument()

    fireEvent.change(search(), { target: { value: 'abc' } })
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }))

    expect(onClear).toHaveBeenCalled()
    expect(search()).toHaveValue('')
  })

  it('applies a select change immediately', () => {
    const { onChange } = setup()
    fireEvent.click(screen.getByRole('combobox', { name: 'Status' }))
    fireEvent.click(screen.getByRole('option', { name: 'Failed' }))
    expect(onChange).toHaveBeenCalledWith({ status: 'failed' })
  })
})
