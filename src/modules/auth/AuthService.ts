import axios from 'axios'
import type { PostAuthResultRequestPayload } from 'src/modules/auth/authTypes'
import type { AuthConfig, IntegrationConfig } from 'src/types'

import { getConfig } from '../../infrastructure/config'
import type { Dependencies } from '../../infrastructure/diConfig'

export class AuthService {
  // private readonly fakeApiClient: FakeIntegrationApiClient
  // constructor({ fakeIntegrationApiClient }: Dependencies) {
  //   this.fakeApiClient = fakeIntegrationApiClient
  // }

  async validate(integrationConfig: IntegrationConfig) {
    if (typeof integrationConfig.apiKey !== 'string') {
      return undefined
    }

    try {
      const res = await axios.get(`${getConfig().integrations.ditto.baseUrl}/components`, {
        headers: {
          Authorization: `token ${integrationConfig.apiKey}`,
          origin: 'lokalise',
        },
      })

      if (res.status !== 200) {
        return undefined
      }

      return {
        apiKey: integrationConfig.apiKey,
      }
    } catch {
      return undefined
    }
  }

  async refresh(config: IntegrationConfig, auth: AuthConfig) {
    // TODO: implementation
    // response structure depends on auth strategy and platform specificity
    return Promise.resolve({
      key: 'apiKey',
    })
  }
}
