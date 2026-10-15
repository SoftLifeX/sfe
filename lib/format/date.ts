const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

/** Assembled from parts so the output does not change with the ICU version ("Mon 5 Oct" vs "Mon, 5 Oct"). */
function dateParts(iso: string) {
  return Object.fromEntries(
    dateFormatter.formatToParts(new Date(iso)).map(({ type, value }) => [type, value])
  )
}

/** "Wed, 30 Sep 2026" */
export function formatDate(iso: string) {
  const { weekday, day, month, year } = dateParts(iso)
  return `${weekday}, ${day} ${month} ${year}`
}

/** "14:22" */
export const formatTime = (iso: string) => timeFormatter.format(new Date(iso))

/** "Wed, 30 Sep 2026, 14:22" */
export const formatDateTime = (iso: string) => `${formatDate(iso)}, ${formatTime(iso)}`

/** Calendar day in the viewer's timezone, e.g. "2026-10-14". */
export const getDayKey = (iso: string | Date) => {
  const date = new Date(iso)
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

/** "Today", "Yesterday", otherwise the full date. */
export function formatDayLabel(iso: string, now = new Date()) {
  const key = getDayKey(iso)
  if (key === getDayKey(now)) return 'Today'
  if (key === getDayKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1))) return 'Yesterday'
  return formatDate(iso)
}
