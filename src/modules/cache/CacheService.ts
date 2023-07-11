import type { Dependencies } from '../../infrastructure/diConfig'
import { AuthFailedError, AuthInvalidDataError } from '../../infrastructure/errors/publicErrors'
import type { APIDitto } from '../../integrations/ditto/client/APIDitto'
import { parseName } from '../../integrations/ditto/mapper'
import type { AuthConfig, IntegrationConfig, ItemIdentifiers } from '../../types'
import { OTHER_COMPONENTS_GROUP } from '../../utils/constants'

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
      const parsedName = parseName(data.name)

      return {
        uniqueId: id,
        groupId: parsedName.groupName?.replaceAll(' ', '') || OTHER_COMPONENTS_GROUP,
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
      const parsedName = parseName(data.name)
      let groupTitle = parsedName.groupName || 'Other components';

      if (data.folder) {
        groupTitle = data.folder + "/" + groupTitle
      }

      return {
        uniqueId: id,
        groupId: parsedName.groupName?.replaceAll(' ', '') || OTHER_COMPONENTS_GROUP,
        metadata: {},
        fields: {
          folder: data.folder || '',
          status: data.status || '',
          notes: data.notes || '',
          tags: data.tags?.join(' ') || '',
        },
        title: parsedName.name,
        groupTitle: groupTitle,
      }
    })
  }
}
