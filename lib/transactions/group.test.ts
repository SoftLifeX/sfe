import type { Transaction } from '@/types/api'
import { groupByDay } from './group'

const tx = (id: string, createdAt: Date): Transaction => ({
  id,
  reference: id,
  type: 'deposit',
  status: 'successful',
  currency: 'NGN',
  amount: 100,
  fee: 0,
  narration: '',
  counterparty: null,
  createdAt: createdAt.toISOString(),
})

describe('groupByDay', () => {
  it('groups consecutive transactions by local day with friendly labels', () => {
    const now = new Date(2026, 9, 14, 12)
    const groups = groupByDay(
      [
        tx('a', new Date(2026, 9, 14, 9)),
        tx('b', new Date(2026, 9, 14, 8)),
        tx('c', new Date(2026, 9, 13, 21)),
        tx('d', new Date(2026, 9, 5, 10)),
      ],
      now
    )

    expect(groups.map((g) => [g.label, g.items.map((i) => i.id)])).toEqual([
      ['Today', ['a', 'b']],
      ['Yesterday', ['c']],
      ['Mon, 5 Oct 2026', ['d']],
    ])
  })
})
