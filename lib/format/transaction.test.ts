import { cleanNarration, getInitials, getTransactionTitle, isCredit } from './transaction'

describe('transaction helpers', () => {
  it('derives initials from the first two words, splitting hyphens', () => {
    expect(getInitials('Ada Okafor')).toBe('AO')
    expect(getInitials('Okonkwo-Adeyemi Logistics & Haulage International Ltd')).toBe('OA')
    expect(getInitials('& Co')).toBe('C')
  })

  it('titles transfers with their counterparty', () => {
    expect(getTransactionTitle({ type: 'transfer_out', counterparty: 'Kwame Mensah' })).toBe(
      'Transfer out to Kwame Mensah'
    )
    expect(getTransactionTitle({ type: 'transfer_in', counterparty: 'Ada Okafor' })).toBe(
      'Transfer in from Ada Okafor'
    )
    expect(getTransactionTitle({ type: 'card_payment', counterparty: null })).toBe('Card payment')
  })

  it('knows which types credit the wallet', () => {
    expect(isCredit('deposit')).toBe(true)
    expect(isCredit('withdrawal')).toBe(false)
  })

  it('strips markup from upstream narration', () => {
    expect(cleanNarration('Bill payment - Spectranet <img src="x" onerror="console.warn(\'x\')">')).toBe(
      'Bill payment - Spectranet'
    )
    expect(cleanNarration('Card <b>payment</b>  -  Netflix')).toBe('Card payment - Netflix')
    expect(cleanNarration('Paid 5 < 10 units')).toBe('Paid 5 < 10 units')
  })
})
