import { getPageItems } from './getPageItems'

describe('getPageItems', () => {
  it('matches the design on the first page', () => {
    expect(getPageItems(1, 12)).toEqual([1, 2, 3, 'ellipsis', 12])
  })

  it('shows neighbours with gaps in the middle', () => {
    expect(getPageItems(6, 12)).toEqual([1, 'ellipsis', 5, 6, 7, 'ellipsis', 12])
  })

  it('fills single-page gaps instead of using an ellipsis', () => {
    expect(getPageItems(4, 12)).toEqual([1, 2, 3, 4, 5, 'ellipsis', 12])
  })

  it('handles the end and short ranges', () => {
    expect(getPageItems(12, 12)).toEqual([1, 'ellipsis', 10, 11, 12])
    expect(getPageItems(2, 3)).toEqual([1, 2, 3])
    expect(getPageItems(1, 1)).toEqual([1])
  })
})
