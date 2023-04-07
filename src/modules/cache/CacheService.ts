import type { Dependencies } from '../../infrastructure/diConfig'
import { CouldNotRetrieveCacheItemsError } from '../../infrastructure/errors/publicErrors'
// import type { FakeIntegrationApiClient } from '../../integrations/fakeIntegration/client/FakeIntegrationApiClient'
import { getWorkspaceComponents, parseName } from '../../services/dittoService'
import type { AuthConfig, IntegrationConfig, ItemIdentifiers } from '../../types'

export class CacheService {
  // private readonly fakeApiClient: FakeIntegrationApiClient
  // constructor({ fakeIntegrationApiClient }: Dependencies) {
  //   this.fakeApiClient = fakeIntegrationApiClient
  // }

  async listItems(integrationConfig: IntegrationConfig, auth: AuthConfig) {
    if (typeof auth.apiKey !== 'string') {
      return undefined
    }

    const validatedData = await getWorkspaceComponents(auth.apiKey)

    if (!validatedData || !validatedData.success) {
      console.error('Unexpected data from Ditto')
      return undefined
    }

    return Object.entries(validatedData.data).map(([id, data]) => ({
      uniqueId: id,
      groupId: parseName(data.name).groupName?.replaceAll(' ', '') || id,
      metadata: {},
    }))
  }

  async getItems(config: IntegrationConfig, auth: AuthConfig, ids: ItemIdentifiers[]) {
    if (typeof auth.apiKey !== 'string') {
      return undefined
    }

    const validatedData = await getWorkspaceComponents(auth.apiKey)

    if (!validatedData || !validatedData.success) {
      console.error('Unexpected data from Ditto')
      return undefined
    }

    const desiredIds = ids.map((id) => id.uniqueId)
    const filteredWorkspaceComponentEntries = Object.entries(validatedData.data).filter(
      ([wsCompId]) => desiredIds.includes(wsCompId),
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
