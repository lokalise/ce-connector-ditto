import type { VariantUpdateData } from '../../services/dittoService'
import { updateVariants } from '../../services/dittoService'
import type { AuthConfig, ContentItem, IntegrationConfig, ItemIdentifiers } from '../../types'

export class PublishService {
  async publishContent(
    config: IntegrationConfig,
    auth: AuthConfig,
    items: ContentItem[],
    // Default locale might not be needed for integration logic
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    defaultLocale: string,
  ): Promise<[boolean | undefined, ItemIdentifiers[]]> {
    if (typeof auth.apiKey !== 'string') {
      return [undefined, []]
    }
    // implementation
    if (items.length === 0) {
      return [true, []]
    }

    const locales = Object.keys(items[0].translations)
    const toUpdate: VariantUpdateData = {}

    for (const locale of locales) {
      toUpdate[locale] = {}
      for (const item of items) {
        toUpdate[locale][item.uniqueId] = { text: item.translations[locale] }
      }
    }

    try {
      await updateVariants(toUpdate, auth.apiKey)

      return [true, []]
    } catch (e) {
      console.error(e)
      return [false, []]
    }
  }
}
