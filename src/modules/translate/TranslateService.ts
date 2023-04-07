import { getWorkspaceComponents, parseName } from '../../services/dittoService'
import type { AuthConfig, ContentItem, IntegrationConfig, ItemIdentifiers } from '../../types'

export class TranslateService {
  async getContent(
    config: IntegrationConfig,
    auth: AuthConfig,
    locales: string[],
    ids: ItemIdentifiers[],
    // Default locale might not be needed for integration logic
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    defaultLocale: string,
  ): Promise<[ContentItem[] | undefined, ItemIdentifiers[]]> {
    if (typeof auth.apiKey !== 'string') {
      return [undefined, []]
    }

    const validatedData = await getWorkspaceComponents(auth.apiKey)

    if (!validatedData || !validatedData.success) {
      console.error('Unexpected data from Ditto')
      return [undefined, []]
    }

    const desiredIds = ids.map((id) => id.uniqueId)
    const filteredWorkspaceComponentEntries = Object.entries(validatedData.data).filter(
      ([wsCompId]) => desiredIds.includes(wsCompId),
    )

    const items = filteredWorkspaceComponentEntries.map(([id, data]) => {
      const localTexts = locales.reduce((acc, local) => {
        if (data.variants && data.variants[local]) {
          acc[local] = data.variants[local].text
        } else {
          acc[local] = ''
        }

        return acc
      }, {} as Record<string, string>)

      return {
        uniqueId: id,
        groupId: parseName(data.name).groupName?.replaceAll(' ', '') || id,
        metadata: {},
        translations: {
          ...localTexts,
          [defaultLocale]: data.text,
        },
      }
    })

    return [items, []]
  }
}
