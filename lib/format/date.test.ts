import { formatDate, formatDateTime, formatDayLabel } from './date'

const local = (day: number, hour: number, minute = 0) => new Date(2026, 9, day, hour, minute).toISOString()

describe('date formatting', () => {
  it('formats dates and times in a stable shape', () => {
    expect(formatDate(local(5, 10, 15))).toBe('Mon, 5 Oct 2026')
    expect(formatDateTime(local(5, 10, 15))).toBe('Mon, 5 Oct 2026, 10:15')
  })

  it('labels today and yesterday relative to the viewer', () => {
    const now = new Date(2026, 9, 14, 12)
    expect(formatDayLabel(local(14, 0, 5), now)).toBe('Today')
    expect(formatDayLabel(local(13, 23, 59), now)).toBe('Yesterday')
    expect(formatDayLabel(local(5, 10), now)).toBe('Mon, 5 Oct 2026')
  })
})
