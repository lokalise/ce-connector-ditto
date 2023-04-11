import type { Dependencies } from '../../infrastructure/diConfig'
import { AuthFailedError } from '../../infrastructure/errors/publicErrors'
import type { APIDitto } from '../../integrations/ditto/client/APIDitto'
import type { VariantUpdateData } from '../../services/dittoService'
import type { AuthConfig, ContentItem, IntegrationConfig, ItemIdentifiers } from '../../types'

export class PublishService {
  private readonly dittoApiClient: APIDitto
  constructor({ dittoApiClient }: Dependencies) {
    this.dittoApiClient = dittoApiClient
  }

  async publishContent(
    config: IntegrationConfig,
    auth: AuthConfig,
    items: ContentItem[],
    // Default locale might not be needed for integration logic
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    defaultLocale: string,
  ): Promise<[boolean | undefined, ItemIdentifiers[]]> {
    const { apiKey } = auth

    if (!apiKey || typeof apiKey !== 'string') {
      throw new AuthFailedError()
    }

    const locales = Object.keys(items[0].translations)
    const toUpdate: VariantUpdateData = {}

    for (const locale of locales) {
      toUpdate[locale] = {}
      for (const item of items) {
        toUpdate[locale][item.uniqueId] = { text: item.translations[locale] }
      }
    }

    const updatePromises: Array<Promise<unknown>> = Object.entries(toUpdate).map(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      async ([variant, data]) => await this.dittoApiClient.updateVariant(apiKey, variant, { data }),
    )

    await Promise.all(updatePromises)

    return [true, []]
  }
}
