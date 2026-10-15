import { hasActiveFilters, parseFilters } from './filters'

const parse = (search: string) => parseFilters(new URLSearchParams(search))

describe('parseFilters', () => {
  it('falls back to defaults', () => {
    expect(parse('')).toEqual({ q: '', type: undefined, status: undefined, page: 1 })
  })

  it('reads valid values', () => {
    expect(parse('q=%20netflix%20&type=card_payment&status=pending&page=3')).toEqual({
      q: 'netflix',
      type: 'card_payment',
      status: 'pending',
      page: 3,
    })
  })

  it('drops values the API would reject', () => {
    expect(parse('type=gift&status=reversed&page=0').page).toBe(1)
    expect(parse('type=gift&status=reversed')).toMatchObject({ type: undefined, status: undefined })
    expect(parse('page=2.5').page).toBe(1)
    expect(parse('page=abc').page).toBe(1)
  })

  it('reports whether any filter is set', () => {
    expect(hasActiveFilters(parse('page=4'))).toBe(false)
    expect(hasActiveFilters(parse('status=failed'))).toBe(true)
  })
})
