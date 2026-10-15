import { api, ApiError } from './client'

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status })

describe('api client', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('throws an ApiError carrying the server code and message', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      json({ error: { code: 'NOT_FOUND', message: 'Transaction x not found' } }, 404)
    )
    await expect(api.get('/transactions/x')).rejects.toMatchObject({
      status: 404,
      code: 'NOT_FOUND',
      message: 'Transaction x not found',
    })
  })

  it('retries transient GET failures', async () => {
    vi.useFakeTimers()
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(json({ error: { code: 'INTERNAL_ERROR', message: 'boom' } }, 500))
      .mockResolvedValueOnce(json({ data: 1 }))

    const result = api.get('/me')
    await vi.advanceTimersByTimeAsync(300)

    await expect(result).resolves.toEqual({ data: 1 })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('does not retry client errors or POSTs', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(json({ error: { code: 'INTERNAL_ERROR', message: 'boom' } }, 500))

    await expect(api.post('/convert', {})).rejects.toBeInstanceOf(ApiError)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
