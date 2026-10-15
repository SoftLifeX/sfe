import { TRANSACTION_STATUS_LABELS, TRANSACTION_TYPE_LABELS } from '@/lib/format'
import type { TransactionStatus, TransactionType } from '@/types/api'

export const pageSize = 20

export interface TransactionFilters {
  q: string
  type?: TransactionType
  status?: TransactionStatus
  page: number
}

export type FilterChanges = Partial<Pick<TransactionFilters, 'q' | 'type' | 'status'>>

const types = Object.keys(TRANSACTION_TYPE_LABELS) as TransactionType[]
const statuses = Object.keys(TRANSACTION_STATUS_LABELS) as TransactionStatus[]

const isOneOf = <T extends string>(options: readonly T[], value: string | null): value is T =>
  value !== null && (options as readonly string[]).includes(value)

/** Reads filters from a URL, discarding anything the API would reject. */
export function parseFilters(params: Pick<URLSearchParams, 'get'>): TransactionFilters {
  const type = params.get('type')
  const status = params.get('status')
  const page = Number(params.get('page'))

  return {
    q: params.get('q')?.trim() ?? '',
    type: isOneOf(types, type) ? type : undefined,
    status: isOneOf(statuses, status) ? status : undefined,
    page: Number.isInteger(page) && page >= 1 ? page : 1,
  }
}

export const hasActiveFilters = ({ q, type, status }: TransactionFilters) => Boolean(q || type || status)
