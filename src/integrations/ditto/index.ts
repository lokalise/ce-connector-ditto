import type { errors } from 'undici'

import type {
  ErrorInfo,
  ErrorInfoWithPerLocaleErrors,
} from '../../infrastructure/errors/MultiStatusErrorResponse'
import { AuthFailedError } from '../../infrastructure/errors/publicErrors'
import type { AuthConfig, ContentItem, ItemIdentifiers } from '../../types'
import { isFulfilled, isRejected } from '../../types'

import type { APIIterable } from './client/APIIterable'
import type { IterableTemplatesListItem } from './client/types'
import { MessageMediumTypes } from './client/types'
import iterableMapper, {
  buildGetCacheErrors,
  buildTranslatePublishError,
  buildPerLocaleErrors,
} from './mapper'
import type { CacheResponseBodyItem, CacheResponseBodyItems } from './mapper/types'
import type {
  LocalesAvailable,
  CacheItemStructure,
  TemplateItemsByTemplateTypeParams,
  TranslatableTemplatesParams,
} from './types'

export const validate = async (apiIterable: APIIterable, key: string): Promise<AuthConfig> => {
  const response = await apiIterable.getAllUserFields(key)
  if (!('fields' in response)) {
    throw new AuthFailedError()
  }
  return { apiKey: key }
}

export const refresh = async (apiIterable: APIIterable, key: string): Promise<AuthConfig> => {
  return validate(apiIterable, key) // API Key is constant in Iterable, no need to refresh
}

export const getPushTemplates = (
  apiIterable: APIIterable,
  templates: IterableTemplatesListItem[],
  apiKey: string,
) =>
  [...new Set(templates.map((template) => template.templateId.toString()))].map((id) => {
    return apiIterable.getPushTemplateById({
      apiKey,
      id,
    })
  })

export const listItems = async (
  apiIterable: APIIterable,
  apiKey: string,
): Promise<ItemIdentifiers[]> => {
  const listItemsPromises = Object.values(MessageMediumTypes).map(async (messageMedium) => {
    const { templates } = await apiIterable.getTemplates(apiKey, MessageMediumTypes[messageMedium])

    const pushTemplates =
      messageMedium == MessageMediumTypes.Push
        ? await Promise.all(getPushTemplates(apiIterable, templates, apiKey))
        : undefined

    const items = iterableMapper.buildItemIdentifiersFromTemplates({
      templates,
      pushTemplates,
      objectType: MessageMediumTypes[messageMedium],
    })
    return items
  })

  const listItems = await Promise.all(listItemsPromises)
  return listItems.flat()
}

export const groupItemsByTemplateType = (items: ItemIdentifiers[]) => {
  return items.reduce((group: Record<string, ItemIdentifiers[]>, item) => {
    const {
      metadata: { templateType },
    } = item
    group[templateType as MessageMediumTypes] = group[templateType as MessageMediumTypes] ?? []
    group[templateType as MessageMediumTypes].push(item)
    return group
  }, {})
}

export const getContentTypesByGroupId = (items: ItemIdentifiers[], groupId: string) =>
  [
    ...new Set(
      items.map((item) => {
        if (item.groupId == groupId) {
          return item.metadata.contentType as string
        }
        return
      }),
    ),
  ].filter((i): i is string => i !== undefined)

export const getTemplateItemsByTemplateType = async (
  apiIterable: APIIterable,
  { templateType, key, templates, items }: TemplateItemsByTemplateTypeParams,
) => {
  if (templateType !== MessageMediumTypes.Email) {
    const { templates: baseTemplateData } = await apiIterable.getTemplates(key, templateType)
    return templates.flatMap((template) => {
      const baseTemplate = baseTemplateData.find(
        (element) => element.templateId === template.templateId,
      )
      if (!baseTemplate) {
        throw new Error('Template not found')
      }
      const contentTypes = getContentTypesByGroupId(items, template.templateId.toString())

      return iterableMapper.buildCacheItemsFromTemplate({
        template,
        templateType,
        baseTemplate,
        contentTypes,
      })
    })
  }
  return templates.flatMap((template) => {
    const contentTypes = getContentTypesByGroupId(items, template.templateId.toString())
    return iterableMapper.buildCacheItemsFromTemplate({ template, templateType, contentTypes })
  })
}

export const getItems = async (
  apiIterable: APIIterable,
  key: string,
  items: ItemIdentifiers[],
): Promise<{
  items: CacheResponseBodyItems
  errors: ErrorInfo[]
}> => {
  let result: CacheResponseBodyItems = []
  let getItemsErrors: ErrorInfo[] = []
  const templateGroupsByTemplateType = groupItemsByTemplateType(items)

  for (const templateType in templateGroupsByTemplateType) {
    const templateIds = [
      ...new Set(templateGroupsByTemplateType[templateType].map((item) => item.groupId)),
    ]
    const templateRequests = templateIds.map((templateId) =>
      apiIterable.getTemplateById({ apiKey: key, id: templateId, templateType }),
    )

    const templatesSettledResult = await Promise.allSettled(templateRequests)

    const fulfilledTemplatesValue = templatesSettledResult
      .filter(isFulfilled)
      .map((fulfilledResult) => fulfilledResult.value)

    const templateTypeErrors = templatesSettledResult.reduce<ErrorInfo[]>((acc, result, index) => {
      if (isRejected(result)) {
        const rejectedGroupId = templateIds[index]
        const rejectedUniqueIds = items
          .filter((item) => item.groupId === rejectedGroupId)
          .map((rejectedItem) => rejectedItem.uniqueId)
        return [
          ...acc,
          ...buildGetCacheErrors(
            rejectedUniqueIds,
            (result.reason as errors.ResponseStatusCodeError)?.statusCode,
          ),
        ]
      }
      return acc
    }, [] as ErrorInfo[])

    getItemsErrors = [...getItemsErrors, ...templateTypeErrors]

    const itemResponses = await getTemplateItemsByTemplateType(apiIterable, {
      templateType,
      key,
      templates: fulfilledTemplatesValue,
      items: templateGroupsByTemplateType[templateType],
    })

    result = result.concat(itemResponses.filter((i): i is CacheResponseBodyItem => i !== undefined))
  }

  return { items: result, errors: getItemsErrors }
}

export const getLocales = async (
  apiIterable: APIIterable,
  key: string,
): Promise<LocalesAvailable> => {
  return {
    defaultLocale: '',
    locales: await apiIterable.getLocales(key),
  }
}

export const getCacheItemStructure = (): CacheItemStructure => {
  return {
    templateId: 'Template id',
    updated: 'Updated',
    creator: 'Creator',
    templateType: 'Template type',
  }
}

const getTemplateAvailableLanguages = (templateTranslatableItems: ContentItem[]): string[] => {
  return [...new Set(templateTranslatableItems.flatMap((item) => Object.keys(item.translations)))]
}

export const publishContent = async (
  apiIterable: APIIterable,
  apiKey: string,
  items: ContentItem[],
): Promise<{
  errors: ErrorInfoWithPerLocaleErrors[]
}> => {
  const publishErrors: ErrorInfoWithPerLocaleErrors[] = []
  const templateIds = [...new Set(items.map((item) => item.groupId))]
  const updateTemplatesRequests = templateIds.map(async (templateId) => {
    const templateTranslatableItems = items.filter((item) => item.groupId === templateId)
    const templateType = templateTranslatableItems[0].metadata.templateType as string

    const availableLanguages = getTemplateAvailableLanguages(templateTranslatableItems)

    const template =
      templateType == MessageMediumTypes.Push
        ? await apiIterable.getPushTemplateById({
            apiKey,
            id: templateId,
          })
        : undefined
    const updateTemplatePayloads = iterableMapper.buildUpdateTemplateRequestBodies({
      templateId,
      templateTranslatableItems,
      availableLanguages,
      templateType,
      template,
    })
    const updateSettledResult = await Promise.allSettled(
      updateTemplatePayloads.map((updateTemplatePayload) =>
        apiIterable.updateTemplate({ apiKey, updateTemplatePayload, templateType }),
      ),
    )
    updateSettledResult.forEach((result, index) => {
      const updatingLocale = updateTemplatePayloads[index]?.locale
      if (isRejected(result) && updatingLocale) {
        const uniqueIdsWithError = items
          .filter((item) => item.groupId === templateId)
          .map((item) => item.uniqueId)

        uniqueIdsWithError.forEach((uniqueId) => {
          const existingError = publishErrors.find((error) => error.uniqueId === uniqueId)
          if (existingError) {
            existingError.perLocaleErrors = {
              ...existingError.perLocaleErrors,
              ...buildPerLocaleErrors(result.reason, updatingLocale),
            }
          } else {
            publishErrors.push(buildTranslatePublishError(result.reason, uniqueId, updatingLocale))
          }
        })
      }
    })

    return updateSettledResult
  })

  await Promise.all(updateTemplatesRequests)

  return { errors: publishErrors }
}

const getTranslatableTemplatesRequestPayloads = ({
  templateIds,
  locales,
  apiKey,
  templateType,
}: TranslatableTemplatesParams): {
  templateType: string
  apiKey: string
  id: string
  locale: string
}[] =>
  templateIds
    .map((templateId) => {
      return locales.map((locale) => ({ templateType, apiKey, id: templateId, locale }))
    })
    .flat()

export const getContent = async (
  apiIterable: APIIterable,
  key: string,
  locales: string[],
  items: ItemIdentifiers[],
): Promise<{
  items: ContentItem[]
  errors: ErrorInfoWithPerLocaleErrors[]
}> => {
  let result: ContentItem[] = []
  const templateGroups = groupItemsByTemplateType(items)
  let translateErrors: ErrorInfoWithPerLocaleErrors[] = []

  for (const templateType in templateGroups) {
    const templateIds = [...new Set(templateGroups[templateType].map((item) => item.groupId))]

    const translatableTemplatesRequestPayloads = getTranslatableTemplatesRequestPayloads({
      templateType,
      templateIds,
      locales,
      apiKey: key,
    })
    const templatesSettledResult = await Promise.allSettled(
      translatableTemplatesRequestPayloads.map((payload) => apiIterable.getTemplateById(payload)),
    )

    const fulfilledTemplatesValue = templatesSettledResult
      .filter(isFulfilled)
      .map((fulfilledResult) => fulfilledResult.value)

    const templateTypeErrors = templatesSettledResult.reduce<ErrorInfoWithPerLocaleErrors[]>(
      (acc, result, index) => {
        if (isRejected(result)) {
          const rejectedGroupId = translatableTemplatesRequestPayloads[index].id
          const rejectedLocale = translatableTemplatesRequestPayloads[index].locale
          const rejectedUniqueIds = items
            .filter((item) => item.groupId === rejectedGroupId)
            .map((rejectedItem) => rejectedItem.uniqueId)

          rejectedUniqueIds.forEach((rejectedId) => {
            const errorItemWithRejectedId = acc.find(
              (errorItem) => errorItem.uniqueId === rejectedId,
            )
            if (errorItemWithRejectedId) {
              errorItemWithRejectedId.perLocaleErrors = {
                ...errorItemWithRejectedId.perLocaleErrors,
                ...buildPerLocaleErrors(result.reason, rejectedLocale),
              }
            } else {
              acc.push(buildTranslatePublishError(result.reason, rejectedId, rejectedLocale))
            }
          })
          return acc
        }
        return acc
      },
      [] as ErrorInfoWithPerLocaleErrors[],
    )

    translateErrors = [...translateErrors, ...templateTypeErrors]

    const itemsWithTranslations = iterableMapper.buildItemWithTranslations({
      locales,
      templateType,
      items: templateGroups[templateType],
      translatableTemplates: fulfilledTemplatesValue,
    })

    result = result.concat(itemsWithTranslations)
  }

  return {
    items: result.filter(
      (item) => !translateErrors.some((error) => error.uniqueId === item.uniqueId),
    ),
    errors: translateErrors,
  }
}
