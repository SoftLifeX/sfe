export type PageItem = number | 'ellipsis'

/** Page numbers to show: first, last, the current page and its neighbours, with gaps collapsed. */
export function getPageItems(page: number, totalPages: number): PageItem[] {
  const wanted = new Set([1, totalPages, page - 1, page, page + 1])
  if (page <= 2) [2, 3].forEach((n) => wanted.add(n))
  if (page >= totalPages - 1) [totalPages - 2, totalPages - 1].forEach((n) => wanted.add(n))

  const pages = [...wanted].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b)
  const items: PageItem[] = []
  pages.forEach((n, i) => {
    const gap = i === 0 ? 1 : n - pages[i - 1]
    if (gap === 2) items.push(n - 1)
    else if (gap > 2) items.push('ellipsis')
    items.push(n)
  })
  return items
}
