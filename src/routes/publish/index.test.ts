import axios from 'axios'
import { FastifyInstance, FastifyBaseLogger, FastifyTypeProviderDefault } from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import getApp from 'src/app'

jest.mock('axios')

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
    // @ts-ignore
    axios.post.mockResolvedValue({
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
