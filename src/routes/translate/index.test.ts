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

describe('request the "/translate" route', () => {
  it('passes', async () => {
    // @ts-ignore
    axios.get.mockResolvedValueOnce({
      status: 200,
      data: {
        '1040-completion': {
          name: '1040 Completion',
          text: 'Complete! You can view the completed 1040 form in your recent documents.',
          status: 'NONE',
          folder: null,
          tags: ['CONFIRMATION'],
          variants: {
            fr: {
              text: '1040 Achevement',
              variables: {
                accountLink: {
                  text: 'here',
                  url: 'https://google.com',
                },
              },
              plurals: {
                zero: 'continuez {{accountLink}}',
                one: 'continuez',
              },
            },
            gr: {
              text: 'fortsetzen',
            },
          },
        },
        'cta.mobileview.continue-message': {
          name: 'CTA/MobileView/Continue Message',
          text: 'Continue or {{linkToMars}} ',
          status: 'NONE',
          folder: 'Nice',
          variables: {
            linkToMars: {
              text: 'Open Website',
              url: 'https://google.com',
            },
          },
          tags: ['BRANCH'],
          variants: {
            fr: {
              text: 'Continuer or {{linkToMars}} ',
            },
            sp: {
              text: 'hola',
            },
          },
        },
        'free-trial-cta': {
          name: 'Free Trial CTA',
          text: 'Try it for free',
          status: 'NONE',
          folder: null,
        },
      },
    })

    const response = await app.inject({
      method: 'POST',
      url: '/v2/translate',
      headers: {
        'CE-Auth': 'eyAiYXBpS2V5IjogIk1USXoiIH0=',
      },
      payload: {
        defaultLocale: 'en',
        locales: ['en', 'fr', 'jp'],
        items: [
          {
            uniqueId: '1040-completion',
            groupId: 'null',
            metadata: {},
          },
          {
            uniqueId: 'cta.mobileview.continue-message',
            groupId: 'CTA',
            metadata: {},
          },
        ],
      },
    })

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body)).toEqual({
      items: [
        {
          uniqueId: '1040-completion',
          groupId: 'null',
          metadata: {},
          translations: {
            en: 'Complete! You can view the completed 1040 form in your recent documents.',
            fr: '1040 Achevement',
            jp: '',
          },
        },
        {
          uniqueId: 'cta.mobileview.continue-message',
          groupId: 'CTA',
          metadata: {},
          translations: {
            en: 'Continue or {{linkToMars}} ',
            fr: 'Continuer or {{linkToMars}} ',
            jp: '',
          },
        },
      ],
      updateItems: [],
    })
  })
})
