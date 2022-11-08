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

describe('requests the "/cache" route', () => {
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
            french: {
              text: 'continuez {{accountLink}}',
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
            german: {
              text: 'fortsetzen',
            },
            portuguese: {
              text: 'continuar',
            },
          },
        },
        'cta.mobileview.continue-message': {
          name: 'CTA/MobileView/Continue Message',
          text: 'Continue or {{linkToMars}} ',
          status: 'NONE',
          folder: null,
          variables: {
            linkToMars: {
              text: 'Open Website',
              url: 'https://google.com',
            },
          },
          tags: ['BRANCH'],
          variants: {
            jordins_variant: {
              text: 'Hello!',
            },
            version_2: {
              text: 'Proceed',
            },
            new_variant_1: {
              text: 'Proceed',
            },
            french1: {
              text: 'French test text!!!',
            },
            'returning-user': {
              text: 'Welcome back!',
            },
          },
        },
      },
    })

    const response = await app.inject({
      method: 'GET',
      url: '/v2/cache',
      headers: {
        'CE-Auth': 'eyAiYXBpS2V5IjogIk1USXoiIH0=',
      },
    })

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body)).toEqual({
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
    })
  })
})

describe('requests the "/cache/items" route', () => {
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
            french: {
              text: 'continuez {{accountLink}}',
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
            german: {
              text: 'fortsetzen',
            },
            portuguese: {
              text: 'continuar',
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
            jordins_variant: {
              text: 'Hello!',
            },
            version_2: {
              text: 'Proceed',
            },
            new_variant_1: {
              text: 'Proceed',
            },
            french1: {
              text: 'French test text!!!',
            },
            'returning-user': {
              text: 'Welcome back!',
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
      url: '/v2/cache/items',
      headers: {
        'CE-Auth': 'eyAiYXBpS2V5IjogIk1USXoiIH0=',
      },
      payload: {
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
          fields: {
            folder: '',
          },
          title: '1040 Completion',
          groupTitle: 'No group',
        },
        {
          uniqueId: 'cta.mobileview.continue-message',
          groupId: 'CTA',
          metadata: {},
          fields: {
            folder: 'Nice',
          },
          title: 'MobileView/Continue Message',
          groupTitle: 'CTA',
        },
      ],
    })
  })
})
