import type { Dependencies } from '../../infrastructure/diConfig'
import { AuthFailedError, AuthInvalidDataError } from '../../infrastructure/errors/publicErrors'
import type { APIDitto } from '../../integrations/ditto/client/APIDitto'
import { parseName } from '../../integrations/ditto/mapper'
import type { AuthConfig, IntegrationConfig, ItemIdentifiers } from '../../types'

export class CacheService {
  private readonly dittoApiClient: APIDitto
  constructor({ dittoApiClient }: Dependencies) {
    this.dittoApiClient = dittoApiClient
  }

  async listItems(integrationConfig: IntegrationConfig, auth: AuthConfig) {
    const { apiKey } = auth

    if (!apiKey) {
      throw new AuthInvalidDataError()
    }
    if (typeof apiKey !== 'string') {
      throw new AuthFailedError()
    }

    const componentsByName = await this.dittoApiClient.getWorkspaceComponents(apiKey)

    return Object.entries(componentsByName).map(([id, data]) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const parsedName = parseName(data.name)

      return {
        uniqueId: id,
        groupId: id,
        metadata: {},
      }
    })
  }

  async getItems(config: IntegrationConfig, auth: AuthConfig, ids: ItemIdentifiers[]) {
    const { apiKey } = auth

    if (!apiKey) {
      throw new AuthInvalidDataError()
    }
    if (typeof apiKey !== 'string') {
      throw new AuthFailedError()
    }

    const componentsByName = await this.dittoApiClient.getWorkspaceComponents(apiKey)

    const desiredIds = ids.map((id) => id.uniqueId)
    const filteredWorkspaceComponentEntries = Object.entries(componentsByName).filter(
      ([wsCompId]) => desiredIds.includes(wsCompId),
    )

    return filteredWorkspaceComponentEntries.map(([id, data]) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const parsedName = parseName(data.name)

      return {
        uniqueId: id,
        groupId: id,
        metadata: {},
        fields: {
          componentId: id,
          status: data.status || '',
          folder: data.folder || '',
          notes: data.notes || '',
          tags: data.tags?.join(' ') || '',
        },
        title: data.name,
        groupTitle: data.name,
      }
    })
  }
}
