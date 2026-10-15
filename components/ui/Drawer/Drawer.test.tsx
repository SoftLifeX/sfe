import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Drawer } from './Drawer'

describe('Drawer', () => {
  it('opens as a labelled modal dialog', () => {
    render(
      <Drawer open title="Transaction details" onClose={() => {}}>
        Body
      </Drawer>
    )
    expect(screen.getByRole('dialog', { name: 'Transaction details' })).toBeInTheDocument()
    expect(screen.getByText('Body')).toBeInTheDocument()
  })

  it('asks to close from the close button, Escape and the backdrop', async () => {
    const onClose = vi.fn()
    render(
      <Drawer open title="Details" onClose={onClose}>
        Body
      </Drawer>
    )
    const dialog = screen.getByRole('dialog')

    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    fireEvent(dialog, new Event('cancel', { cancelable: true }))
    await userEvent.click(dialog)
    await userEvent.click(screen.getByText('Body'))

    expect(onClose).toHaveBeenCalledTimes(3)
  })

  it('closes the dialog after the exit animation', () => {
    vi.useFakeTimers()
    const { rerender } = render(
      <Drawer open title="Details" onClose={() => {}}>
        Body
      </Drawer>
    )
    rerender(
      <Drawer open={false} title="Details" onClose={() => {}}>
        Body
      </Drawer>
    )
    vi.advanceTimersByTime(250)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    vi.useRealTimers()
  })
})
