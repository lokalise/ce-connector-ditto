import { APIAbstract } from './APIAbstract'

const mockRequest = jest.fn()

const mockResponse = {
  statusCode: 200,
  headers: {
    'content-type': 'application/json; charset=UTF-8',
    vary: ['X-Origin', 'Referer', 'Origin,Accept-Encoding'],
    date: 'Mon, 24 Oct 2022 10:01:27 GMT',
    server: 'scaffolding on HTTPServer2',
    'cache-control': 'private',
    'x-xss-protection': '0',
    'x-frame-options': 'SAMEORIGIN',
    'x-content-type-options': 'nosniff',
    'accept-ranges': 'none',
    'transfer-encoding': 'chunked',
    'alt-svc':
      'h3=":443"; ma=2592000,h3-29=":443"; ma=2592000,h3-Q050=":443"; ma=2592000,h3-Q046=":443"; ma=2592000,h3-Q043=":443"; ma=2592000,quic=":443"; ma=2592000; v="46,43"',
  },
  trailers: {},
  opaque: null,
  body: {
    json: () => Promise.resolve({ message: 'mockJsonBody' }),
    text: () => Promise.resolve('mockTextBody'),
  },
}

const mockRequestDetails = {
  body: { foo: 'bar' },
  headers: { header: 'fakeHeader' },
  apiKey: 'some-api-key',
  query: { query: 'fakeQuery' },
}

const mockCheckExceptionValidity = jest.fn()

jest.mock('undici', () => ({
  Client: jest.fn(() => ({ request: mockRequest })),
}))

describe('APIAbstract', () => {
  beforeEach(() => {
    mockRequest.mockResolvedValue(mockResponse)
    mockCheckExceptionValidity.mockImplementation(() => false)
  })
  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })
  const abstractApi = new APIAbstract('https://example')

  describe('send method', () => {
    it('makes request with expected parameters', async () => {
      await abstractApi.send('GET', 'https://fakeurl', mockRequestDetails)
      expect(mockRequest).toHaveBeenCalledTimes(1)
      expect(mockRequest).toHaveBeenCalledWith({
        body: '{"foo":"bar"}',
        headers: {
          Authorization: 'token some-api-key',
          'Content-Type': 'application/json',
          header: 'fakeHeader',
          origin: 'lokalise',
        },
        method: 'GET',
        path: 'https://fakeurl',
        query: {
          query: 'fakeQuery',
        },
        throwOnError: true,
      })
    })

    it('parses response body on success', async () => {
      const parsedResponse = await abstractApi.send('PUT', 'https://fakeurl', mockRequestDetails)
      expect(parsedResponse).toMatchObject({ message: 'mockJsonBody' })
    })
  })

  describe('get method', () => {
    it('submits get request', async () => {
      await abstractApi.get('https://fakeurl', mockRequestDetails)
      expect(mockRequest).toHaveBeenCalledTimes(1)
      expect(mockRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          path: 'https://fakeurl',
          headers: {
            Authorization: 'token some-api-key',
            'Content-Type': 'application/json',
            header: 'fakeHeader',
            origin: 'lokalise',
          },
          query: { query: 'fakeQuery' },
          body: '{"foo":"bar"}',
          throwOnError: true,
        }),
      )
    })

    it('throws AuthInvalidDataError in case of 401 response', async () => {
      // Simulate a 401 error
      mockRequest.mockImplementation(() => {
        throw { statusCode: 401 }
      })

      await expect(abstractApi.get('https://fakeurl', mockRequestDetails)).rejects.toEqual(
        expect.objectContaining({
          message: 'Authorization failed',
        }),
      )
    })
  })

  describe('post method', () => {
    it('submits post request', async () => {
      await abstractApi.post('https://fakeurl', mockRequestDetails)
      expect(mockRequest).toHaveBeenCalledTimes(1)
      expect(mockRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          path: 'https://fakeurl',
          headers: {
            Authorization: 'token some-api-key',
            'Content-Type': 'application/json',
            header: 'fakeHeader',
            origin: 'lokalise',
          },
          query: { query: 'fakeQuery' },
          body: '{"foo":"bar"}',
          throwOnError: true,
        }),
      )
    })

    it('throws AuthInvalidDataError in case of 401 response', async () => {
      // Simulate a 401 error
      mockRequest.mockImplementation(() => {
        throw { statusCode: 401 }
      })

      await expect(abstractApi.post('https://fakeurl', mockRequestDetails)).rejects.toEqual(
        expect.objectContaining({
          message: 'Authorization failed',
        }),
      )
    })
  })
})
