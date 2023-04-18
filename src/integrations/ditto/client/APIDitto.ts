import { buildClient, sendGet, sendPut } from '@lokalise/node-core'
import type { Client } from 'undici'

import type { Dependencies } from '../../../infrastructure/diConfig'
import { AuthFailedError, UnrecognizedError } from '../../../infrastructure/errors/publicErrors'

import type {
  UpdateVariantRequestBody,
  UpdateVariantResult,
  WorkspaceComponentsByName,
} from './types'

export class APIDitto {
  private readonly client: Client

  constructor({ config }: Dependencies) {
    const host = config.integrations.ditto.baseUrl
    if (!host) {
      throw new Error('Ditto API path not provided')
    }
    this.client = buildClient(host, {
      bodyTimeout: 5000,
      headersTimeout: 5000,
    })
  }

  private extractHeaders(apiKey: string) {
    return {
      Authorization: `token ${apiKey}`,
      origin: 'lokalise',
      'Content-Type': 'application/json',
    }
  }

  private extractRetryConfig() {
    return {
      maxAttempts: 3,
      delayBetweenAttemptsInMsecs: 100,
      statusCodesToRetry: [500, 502, 503],
      retryOnTimeout: false,
    }
  }

  public async getWorkspaceComponents(apiKey: string) {
    const response = await sendGet<WorkspaceComponentsByName>(this.client, '/components', {
      headers: this.extractHeaders(apiKey),
      throwOnError: false,
      retryConfig: this.extractRetryConfig(),
    })

    if (response.error) {
      if (response.error.statusCode === 401) {
        throw new AuthFailedError()
      }
      throw new UnrecognizedError()
    }
    return response.result.body
  }

  public async updateVariant(
    apiKey: string,
    variant: string,
    updateVariantPayload: UpdateVariantRequestBody,
  ) {
    const response = await sendPut<UpdateVariantResult>(
      this.client,
      '/components',
      updateVariantPayload,
      {
        headers: this.extractHeaders(apiKey),
        query: { variant },
        throwOnError: true,
        retryConfig: this.extractRetryConfig(),
      },
    )

    return response.result.body
  }
}
