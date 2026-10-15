import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Select } from './Select'

const options = [
  { value: '', label: 'All types' },
  { value: 'deposit', label: 'Deposit' },
  { value: 'withdrawal', label: 'Withdrawal' },
]

const setup = (value = '') => {
  const onChange = vi.fn()
  render(<Select label="Type" options={options} value={value} onChange={onChange} />)
  return { onChange, trigger: screen.getByRole('combobox', { name: 'Type' }) }
}

describe('Select', () => {
  it('shows the selected label and marks it in the list', async () => {
    const { trigger } = setup('deposit')
    expect(trigger).toHaveTextContent('Deposit')
    await userEvent.click(trigger)
    expect(screen.getByRole('option', { name: 'Deposit' })).toHaveAttribute('aria-selected', 'true')
  })

  it('selects with the pointer', async () => {
    const { trigger, onChange } = setup()
    await userEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await userEvent.click(screen.getByRole('option', { name: 'Withdrawal' }))
    expect(onChange).toHaveBeenCalledWith('withdrawal')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('supports the keyboard: arrows, Enter, Escape and typeahead', async () => {
    const { trigger, onChange } = setup()
    trigger.focus()
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}')
    expect(onChange).toHaveBeenLastCalledWith('deposit')

    await userEvent.keyboard('{ArrowDown}{Escape}')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await userEvent.keyboard('w{Enter}')
    expect(onChange).toHaveBeenLastCalledWith('withdrawal')
  })

  it('closes on an outside press', async () => {
    const { trigger } = setup()
    await userEvent.click(trigger)
    await userEvent.click(document.body)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })
})
