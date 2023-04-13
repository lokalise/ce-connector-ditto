import type { AuthConfig, IntegrationConfig } from 'src/types'

import type { Dependencies } from '../../infrastructure/diConfig'
import { AuthFailedError, AuthInvalidDataError } from '../../infrastructure/errors/publicErrors'
import type { APIDitto } from '../../integrations/ditto/client/APIDitto'

export class AuthService {
  private readonly dittoApiClient: APIDitto
  constructor({ dittoApiClient }: Dependencies) {
    this.dittoApiClient = dittoApiClient
  }

  async validate(integrationConfig: IntegrationConfig): Promise<AuthConfig> {
    const { apiKey } = integrationConfig
    if (!apiKey) {
      throw new AuthInvalidDataError()
    }
    if (typeof apiKey !== 'string') {
      throw new AuthFailedError()
    }

    await this.dittoApiClient.getWorkspaceComponents(apiKey)

    return { apiKey }
  }

  async refresh(config: IntegrationConfig, auth: AuthConfig): Promise<AuthConfig> {
    return await this.validate(auth)
  }
}
