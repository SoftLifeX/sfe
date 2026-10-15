import { render, screen } from '@testing-library/react'
import { Money } from './Money'

describe('Money', () => {
  it('formats minor units with fixed decimals', () => {
    render(<Money amount={150000} currency="NGN" />)
    expect(screen.getByText('₦1,500.00')).toBeInTheDocument()
  })

  it('prefixes credits and debits', () => {
    render(
      <>
        <Money amount={4599} currency="USD" sign="debit" />
        <Money amount={2499999999999} currency="NGN" sign="credit" />
      </>
    )
    expect(screen.getByText('\u2212$45.99')).toBeInTheDocument()
    expect(screen.getByText('+₦24,999,999,999.99')).toBeInTheDocument()
  })
})
