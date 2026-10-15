import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Transaction } from '@/types/api'
import { TransactionRow } from './TransactionRow'

const base: Transaction = {
  id: 'txn_1',
  reference: 'ACM-1',
  type: 'card_payment',
  status: 'successful',
  currency: 'USD',
  amount: 4599,
  fee: 0,
  narration: 'Card payment - Netflix',
  counterparty: null,
  createdAt: new Date(2026, 9, 14, 14, 22).toISOString(),
}

describe('TransactionRow', () => {
  it('shows a debit with its sign, status and time', () => {
    render(<TransactionRow transaction={base} timeOnly />)
    expect(screen.getByText('\u2212$45.99')).toBeInTheDocument()
    expect(screen.getByText('Successful')).toBeInTheDocument()
    expect(screen.getByText('14:22')).toBeInTheDocument()
  })

  it('shows credits in green with a plus', () => {
    render(<TransactionRow transaction={{ ...base, type: 'deposit', currency: 'NGN', amount: 50000000 }} />)
    expect(screen.getByText('+₦500,000.00')).toBeInTheDocument()
  })

  it('strips markup from narration instead of rendering or printing it', () => {
    const narration = 'Bill payment - Spectranet <img src="x" onerror="alert(1)">'
    const { container } = render(<TransactionRow transaction={{ ...base, narration }} />)
    expect(screen.getByText('Bill payment - Spectranet')).toBeInTheDocument()
    expect(container.querySelector('img')).toBeNull()
    expect(container).not.toHaveTextContent('onerror')
  })

  it('uses counterparty initials for transfers', () => {
    render(<TransactionRow transaction={{ ...base, type: 'transfer_out', counterparty: 'Kwame Mensah' }} />)
    expect(screen.getByText('KM')).toBeInTheDocument()
  })

  it('selects the transaction on click', async () => {
    const onSelect = vi.fn()
    render(<TransactionRow transaction={base} onSelect={onSelect} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onSelect).toHaveBeenCalledWith(base)
  })
})
