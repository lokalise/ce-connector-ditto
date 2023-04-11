import axios from 'axios'
import type { PostAuthResultRequestPayload } from 'src/modules/auth/authTypes'
import type { AuthConfig, IntegrationConfig } from 'src/types'

import { getConfig } from '../../infrastructure/config'
import type { Dependencies } from '../../infrastructure/diConfig'
import { AuthFailedError } from '../../infrastructure/errors/publicErrors'
import type { APIDitto } from '../../integrations/ditto/client/APIDitto'
import type { WorkspaceComponentsByName } from '../../integrations/ditto/client/types'

export class AuthService {
  private readonly dittoApiClient: APIDitto
  constructor({ dittoApiClient }: Dependencies) {
    this.dittoApiClient = dittoApiClient
  }

  async validate(integrationConfig: IntegrationConfig): Promise<AuthConfig> {
    const { apiKey } = integrationConfig
    if (!apiKey || typeof apiKey !== 'string') {
      throw new AuthFailedError()
    }

    const workspaceComponents = await this.dittoApiClient.getWorkspaceComponents(apiKey)

    return { apiKey }
  }

  async refresh(config: IntegrationConfig, auth: AuthConfig): Promise<AuthConfig> {
    return await this.validate(auth)
  }
}
