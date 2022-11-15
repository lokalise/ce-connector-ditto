import type { Server, IncomingMessage, ServerResponse } from 'http'

import axios from 'axios'
import type { FastifyInstance, FastifyBaseLogger, FastifyTypeProviderDefault } from 'fastify'

import getApp from '../../app'

jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>

let app: FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse,
  FastifyBaseLogger,
  FastifyTypeProviderDefault
>

beforeAll(async () => {
  app = await getApp()
})

describe('request the "/publish" route', () => {
  it('passes', async () => {
    mockedAxios.post.mockResolvedValue({
      status: 200,
      data: {},
    })

    const response = await app.inject({
      method: 'POST',
      url: '/v2/publish',
      headers: {
        'CE-Auth': 'eyAiYXBpS2V5IjogIk1USXoiIH0=',
      },
      payload: {
        defaultLocale: 'en',
        items: [
          {
            uniqueId: '1040-completion',
            groupId: 'null',
            metadata: {},
            translations: {
              en: 'Complete! You can view the completed 1040 form in your recent documents.',
              fr: '1040 Achevement',
              jp: 'Dekita!',
            },
          },
          {
            uniqueId: 'cta.mobileview.continue-message',
            groupId: 'CTA',
            metadata: {},
            translations: {
              en: 'Continue or {{linkToMars}} ',
              fr: 'Continuer or {{linkToMars}} ',
              jp: 'Kusai',
            },
          },
        ],
      },
    })

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body)).toEqual({
      status: 200,
      message: 'Content successfully updated',
      updateItems: [],
    })
  })
})
