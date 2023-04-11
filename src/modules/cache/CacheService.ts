import type { Dependencies } from '../../infrastructure/diConfig'
import { AuthFailedError } from '../../infrastructure/errors/publicErrors'
import type { APIDitto } from '../../integrations/ditto/client/APIDitto'
import { parseName } from '../../services/dittoService'
import type { AuthConfig, IntegrationConfig, ItemIdentifiers } from '../../types'

export class CacheService {
  private readonly dittoApiClient: APIDitto
  constructor({ dittoApiClient }: Dependencies) {
    this.dittoApiClient = dittoApiClient
  }

  async listItems(integrationConfig: IntegrationConfig, auth: AuthConfig) {
    const { apiKey } = auth

    if (!apiKey || typeof apiKey !== 'string') {
      throw new AuthFailedError()
    }

    const componentsByName = await this.dittoApiClient.getWorkspaceComponents(apiKey)

    // if (!validatedData || !validatedData.success) {
    //   console.error('Unexpected data from Ditto')
    //   return undefined
    // }

    return Object.entries(componentsByName).map(([id, data]) => ({
      uniqueId: id,
      groupId: parseName(data.name).groupName?.replaceAll(' ', '') || id,
      metadata: {},
    }))
  }

  async getItems(config: IntegrationConfig, auth: AuthConfig, ids: ItemIdentifiers[]) {
    const { apiKey } = auth

    if (!apiKey || typeof apiKey !== 'string') {
      throw new AuthFailedError()
    }

    const validatedData = await this.dittoApiClient.getWorkspaceComponents(apiKey)

    // if (!validatedData || !validatedData.success) {
    //   console.error('Unexpected data from Ditto')
    //   return undefined
    // }

    const desiredIds = ids.map((id) => id.uniqueId)
    const filteredWorkspaceComponentEntries = Object.entries(validatedData).filter(([wsCompId]) =>
      desiredIds.includes(wsCompId),
    )

    return filteredWorkspaceComponentEntries.map(([id, data]) => {
      const parsedName = parseName(data.name)

      return {
        uniqueId: id,
        groupId: parsedName.groupName?.replaceAll(' ', '') || id,
        metadata: {},
        fields: {
          folder: data.folder || '',
        },
        title: parsedName.name,
        groupTitle: parsedName.groupName || 'No group',
      }
    })
  }
}
