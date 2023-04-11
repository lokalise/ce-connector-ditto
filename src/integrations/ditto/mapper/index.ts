import type { errors } from 'undici'

import type {
  ErrorInfo,
  ErrorInfoWithPerLocaleErrors,
  PerLocaleError,
} from '../../../infrastructure/errors/MultiStatusErrorResponse'
import {
  PerLocaleErrorCode,
  SingleItemErrorCode,
} from '../../../infrastructure/errors/MultiStatusErrorResponse'
import { AuthFailedError } from '../../../infrastructure/errors/publicErrors'
import type { ContentItem, ItemIdentifiers } from '../../../types'
import { isObject } from '../../../types'
import type {
  CacheItemsFromTemplateParams,
  IterableEmailTemplate,
  IterableInAppTemplate,
  IterablePushTemplate,
  IterableSMSTemplate,
  IterableTemplatesListItem,
  UpdateEmailTemplateRequestBody,
  UpdateInAppTemplateRequestBody,
  UpdatePushTemplateRequestBody,
  UpdateSMSTemplateRequestBody,
} from '../client/types'
import { PushButtonTypes, MessageMediumTypes, isErrorResponse } from '../client/types'

import type {
  CacheResponseBodyItem,
  CacheResponseBodyItemField,
  ContentItemsTranslationsByLanguageAndContentTypeParams,
  EmailTemplateRequestBodiesForUpdatingParams,
  InAppTemplateRequestBodiesForUpdatingParams,
  ItemIdentifiersFromTemplates,
  ItemWithTranslations,
  PushTemplateRequestBodiesForUpdatingParams,
  SMSTemplateRequestBodiesForUpdatingParams,
  TemplateFieldValueParams,
  TemplateRequestBodiesForUpdatingParams,
  TranslationsForButtonsParams,
} from './types'
import {
  EmailContentTitles,
  InAppContentTitles,
  PushContentTitles,
  SMSContentTitles,
  InAppContentTypes,
  PushContentTypes,
  SMSContentTypes,
  EmailContentTypes,
} from './types'

const IDENTIFIER_SEPARATOR = '||'

const buildUniqueId = (templateId: string, contentType: string) =>
  `${templateId}${IDENTIFIER_SEPARATOR}${contentType}`

const buildItemIdentifierWithContentType = (
  templateId: string,
  contentType: string,
  templateType: string,
) => ({
  metadata: { contentType, templateType },
  uniqueId: buildUniqueId(templateId, contentType),
  groupId: templateId,
})

const buildItemIdentifierForEmail = (id: string) => [
  buildItemIdentifierWithContentType(id, EmailContentTypes.Subject, MessageMediumTypes.Email),
  buildItemIdentifierWithContentType(id, EmailContentTypes.PreheaderText, MessageMediumTypes.Email),
  buildItemIdentifierWithContentType(id, EmailContentTypes.Html, MessageMediumTypes.Email),
]

const buildItemIdentifierWithContentTypeForButtons = (
  id: string,
  pushTemplate: IterablePushTemplate,
) =>
  pushTemplate.buttons?.flatMap((button, index) => {
    const defaultButtonItems = [
      buildItemIdentifierWithContentType(
        id,
        PushContentTypes.ButtonTitle + `_${index + 1}`,
        MessageMediumTypes.Push,
      ),
      buildItemIdentifierWithContentType(
        id,
        PushContentTypes.ButtonIdentifier + `_${index + 1}`,
        MessageMediumTypes.Push,
      ),
    ]
    if (button.buttonType === PushButtonTypes.TextInput) {
      return [
        ...defaultButtonItems,
        buildItemIdentifierWithContentType(
          id,
          PushContentTypes.ButtonInputPlaceholder + `_${index + 1}`,
          MessageMediumTypes.Push,
        ),
        buildItemIdentifierWithContentType(
          id,
          PushContentTypes.ButtonInputTitle + `_${index + 1}`,
          MessageMediumTypes.Push,
        ),
      ]
    }
    return defaultButtonItems
  }) ?? []

const buildItemIdentifierForPush = (id: string, pushTemplate: IterablePushTemplate) => [
  buildItemIdentifierWithContentType(id, PushContentTypes.Payload, MessageMediumTypes.Push),
  buildItemIdentifierWithContentType(id, PushContentTypes.Title, MessageMediumTypes.Push),
  buildItemIdentifierWithContentType(id, PushContentTypes.Message, MessageMediumTypes.Push),
  ...buildItemIdentifierWithContentTypeForButtons(id, pushTemplate),
]

const buildItemIdentifierForInApp = (id: string) => [
  buildItemIdentifierWithContentType(id, InAppContentTypes.Payload, MessageMediumTypes.InApp),
  buildItemIdentifierWithContentType(id, InAppContentTypes.Html, MessageMediumTypes.InApp),
]

const buildItemIdentifierForSMS = (id: string) => [
  buildItemIdentifierWithContentType(id, SMSContentTypes.Message, MessageMediumTypes.SMS),
]

const buildItemIdentifiersFromTemplates = ({
  templates,
  objectType,
  pushTemplates,
}: ItemIdentifiersFromTemplates): ItemIdentifiers[] => {
  return templates.flatMap((template) => {
    const templateId = template.templateId.toString()
    switch (objectType) {
      case MessageMediumTypes.Email:
        return buildItemIdentifierForEmail(templateId)
      case MessageMediumTypes.Push: {
        const pushTemplate = pushTemplates?.find(
          (pushTemplate) => pushTemplate.templateId === template.templateId,
        )
        if (!pushTemplate) {
          throw new Error('Push template not found')
        }
        return buildItemIdentifierForPush(templateId, pushTemplate)
      }
      case MessageMediumTypes.InApp:
        return buildItemIdentifierForInApp(templateId)
      case MessageMediumTypes.SMS:
        return buildItemIdentifierForSMS(templateId)
      default:
        return []
    }
  })
}

const formatDate = (dateMilliseconds: number): string => {
  const date = new Date(dateMilliseconds)

  const year = date.getFullYear()
  const month = (1 + date.getMonth()).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  return `${day}-${month}-${year}`
}

const buildTemplateTypeField = (templateType: MessageMediumTypes): string => {
  return templateType === MessageMediumTypes.InApp ? 'In-app' : templateType
}

export const buildGetCacheErrors = (
  rejectedUniqueIds: string[],
  statusCode: number,
): ErrorInfo[] => {
  if (statusCode === 401) {
    throw new AuthFailedError()
  }
  return rejectedUniqueIds.map((uniqueId) => ({
    uniqueId,
    errorCode:
      statusCode === 400 || statusCode === 404
        ? SingleItemErrorCode.ItemNotFoundErrorCode
        : SingleItemErrorCode.UnrecognizedErrorCode,
  }))
}

export const buildTranslatePublishError = (
  error: unknown,
  rejectedUniqueId: string,
  rejectedLocale: string,
): ErrorInfoWithPerLocaleErrors => {
  return {
    uniqueId: rejectedUniqueId,
    perLocaleErrors: buildPerLocaleErrors(error, rejectedLocale),
  }
}

export const buildPerLocaleErrors = (
  error: unknown,
  rejectedLocale: string,
): Record<string, PerLocaleError> => {
  const { statusCode } = error as errors.ResponseStatusCodeError
  if (statusCode === 401) {
    throw new AuthFailedError()
  }
  return {
    [rejectedLocale]:
      isErrorResponse(error) && (statusCode === 404 || statusCode === 400)
        ? { userErrors: [error.body.msg] }
        : { errorCode: PerLocaleErrorCode.UnrecognizedErrorCode },
  }
}

const buildCacheItemFieldWithMetadata = (
  template: IterableEmailTemplate,
  templateType: MessageMediumTypes,
): CacheResponseBodyItemField => {
  const {
    templateId,
    metadata: { updatedAt, creatorUserId },
  } = template

  return {
    templateId,
    updated: formatDate(updatedAt),
    creator: creatorUserId,
    templateType: buildTemplateTypeField(templateType),
  }
}

const buildCacheItemField = (
  template: IterableTemplatesListItem,
  templateType: MessageMediumTypes,
): CacheResponseBodyItemField => {
  const { templateId, updatedAt, creatorUserId } = template
  return {
    templateId,
    updated: formatDate(updatedAt),
    creator: creatorUserId,
    templateType: buildTemplateTypeField(templateType),
  }
}

const buildCacheItemsFromEmailTemplate = (
  contentTypes: string[],
  template: IterableEmailTemplate,
): CacheResponseBodyItem[] =>
  contentTypes.map((contentType) => ({
    fields: buildCacheItemFieldWithMetadata(template, MessageMediumTypes.Email),
    groupTitle: template?.name ?? '',
    title: EmailContentTitles[contentType as keyof typeof EmailContentTitles],
    ...buildItemIdentifierWithContentType(
      template.templateId.toString(),
      contentType,
      MessageMediumTypes.Email,
    ),
  }))

const buildCacheItemsFromInAppTemplate = (
  contentTypes: string[],
  template: IterableInAppTemplate,
  baseTemplate: IterableTemplatesListItem,
): CacheResponseBodyItem[] =>
  contentTypes.map((contentType) => ({
    fields: buildCacheItemField(baseTemplate, MessageMediumTypes.InApp),
    groupTitle: template?.name ?? '',
    title: InAppContentTitles[contentType as keyof typeof InAppContentTitles],
    ...buildItemIdentifierWithContentType(
      template.templateId.toString(),
      contentType,
      MessageMediumTypes.InApp,
    ),
  }))

const buildCacheItemsFromSMSTemplate = (
  contentTypes: string[],
  template: IterableSMSTemplate,
  baseTemplate: IterableTemplatesListItem,
): CacheResponseBodyItem[] =>
  contentTypes.map((contentType) => ({
    fields: buildCacheItemField(baseTemplate, MessageMediumTypes.SMS),
    groupTitle: template?.name ?? '',
    title: SMSContentTitles[contentType as keyof typeof SMSContentTitles],
    ...buildItemIdentifierWithContentType(
      template.templateId.toString(),
      contentType,
      MessageMediumTypes.SMS,
    ),
  }))

const buildCacheItemsFromPushTemplate = (
  contentTypes: string[],
  template: IterablePushTemplate,
  baseTemplate: IterableTemplatesListItem,
): CacheResponseBodyItem[] =>
  contentTypes.map((contentType) => ({
    fields: buildCacheItemField(baseTemplate, MessageMediumTypes.Push),
    groupTitle: template?.name ?? '',
    title: PushContentTitles[contentType as keyof typeof PushContentTitles],
    ...buildItemIdentifierWithContentType(
      template.templateId.toString(),
      contentType,
      MessageMediumTypes.Push,
    ),
  }))

const buildCacheItemsFromTemplate = ({
  template,
  templateType,
  baseTemplate,
  contentTypes,
}: CacheItemsFromTemplateParams) => {
  switch (templateType) {
    case MessageMediumTypes.Email:
      return buildCacheItemsFromEmailTemplate(contentTypes, template as IterableEmailTemplate)
    case MessageMediumTypes.Push:
      if (!baseTemplate) {
        throw new Error('Template not found')
      }
      return buildCacheItemsFromPushTemplate(
        contentTypes,
        template as IterablePushTemplate,
        baseTemplate,
      )
    case MessageMediumTypes.InApp:
      if (!baseTemplate) {
        throw new Error('Template not found')
      }
      return buildCacheItemsFromInAppTemplate(
        contentTypes,
        template as IterableInAppTemplate,
        baseTemplate,
      )
    case MessageMediumTypes.SMS:
      if (!baseTemplate) {
        throw new Error('Template not found')
      }
      return buildCacheItemsFromSMSTemplate(
        contentTypes,
        template as IterableSMSTemplate,
        baseTemplate,
      )
    default:
      throw new Error('Unsupported template type')
  }
}

const getTranslations = (
  templateTranslatableItems: ContentItem[],
  contentType: EmailContentTypes | SMSContentTypes | PushContentTypes | InAppContentTypes,
): Record<string, string> | undefined => {
  return templateTranslatableItems.find((item) => item.metadata.contentType === contentType)
    ?.translations
}

const getContentItemsTranslationsByLanguageAndContentType = ({
  templateTranslatableItems,
  contentType,
  language,
}: ContentItemsTranslationsByLanguageAndContentTypeParams) =>
  templateTranslatableItems.find(
    (templateTranslatableItem) => templateTranslatableItem.metadata.contentType === contentType,
  )?.translations[language]

const getTranslationsForButtons = ({
  availableLanguages,
  template,
  templateTranslatableItems,
}: TranslationsForButtonsParams) =>
  availableLanguages.reduce((acc, language) => {
    return {
      ...acc,
      [language]: template?.buttons?.map((button, index) => {
        const newButtonTitle = getContentItemsTranslationsByLanguageAndContentType({
          templateTranslatableItems,
          contentType: PushContentTypes.ButtonTitle + `_${index + 1}`,
          language,
        })
        const newButtonIdentifier = getContentItemsTranslationsByLanguageAndContentType({
          templateTranslatableItems,
          contentType: PushContentTypes.ButtonIdentifier + `_${index + 1}`,
          language,
        })
        const newButtonInputTitle = getContentItemsTranslationsByLanguageAndContentType({
          templateTranslatableItems,
          contentType: PushContentTypes.ButtonInputTitle + `_${index + 1}`,
          language,
        })
        const newButtonInputPlaceholder = getContentItemsTranslationsByLanguageAndContentType({
          templateTranslatableItems,
          contentType: PushContentTypes.ButtonInputPlaceholder + `_${index + 1}`,
          language,
        })

        return {
          ...button,
          identifier: newButtonIdentifier ?? '',
          title: newButtonTitle ?? '',
          inputPlaceholder: newButtonInputPlaceholder ?? '',
          inputTitle: newButtonInputTitle ?? '',
        }
      }),
    }
  }, {})

const buildUpdateTemplateBodiesForEmail = ({
  templateId,
  templateTranslatableItems,
  availableLanguages,
}: EmailTemplateRequestBodiesForUpdatingParams) => {
  const preheaderTextTranslates = getTranslations(
    templateTranslatableItems,
    EmailContentTypes.PreheaderText,
  )
  const htmlTranslates = getTranslations(templateTranslatableItems, EmailContentTypes.Html)
  const subjectTranslates = getTranslations(templateTranslatableItems, EmailContentTypes.Subject)

  return availableLanguages.map((language) => ({
    templateId: Number(templateId),
    preheaderText: preheaderTextTranslates?.[language] ?? '',
    html: htmlTranslates?.[language] ?? '',
    subject: subjectTranslates?.[language] ?? '',
    locale: language,
  }))
}

const buildUpdateTemplateBodiesForPush = ({
  templateId,
  templateTranslatableItems,
  availableLanguages,
  template,
}: PushTemplateRequestBodiesForUpdatingParams) => {
  const titleTranslates = getTranslations(templateTranslatableItems, PushContentTypes.Title)

  const messageTranslates = getTranslations(templateTranslatableItems, PushContentTypes.Message)

  const buttonsTranslates = getTranslationsForButtons({
    availableLanguages,
    template,
    templateTranslatableItems,
  })

  const payloadTranslates = getTranslations(templateTranslatableItems, InAppContentTypes.Payload)
  return availableLanguages.map((language) => ({
    templateId: Number(templateId),
    title: titleTranslates?.[language] ?? '',
    message: messageTranslates?.[language] ?? '',
    payload: payloadTranslates?.[language]
      ? (JSON.parse(payloadTranslates?.[language]) as Record<string, unknown>)
      : {
          type: '',
          data: '',
        },
    buttons: buttonsTranslates?.[language as keyof typeof buttonsTranslates],
    locale: language,
  }))
}

const buildUpdateTemplateBodiesForInApp = ({
  templateId,
  templateTranslatableItems,
  availableLanguages,
}: InAppTemplateRequestBodiesForUpdatingParams) => {
  const htmlTranslates = getTranslations(templateTranslatableItems, InAppContentTypes.Html)

  const payloadTranslates = getTranslations(templateTranslatableItems, InAppContentTypes.Payload)

  return availableLanguages.map((language) => ({
    templateId: Number(templateId),
    html: htmlTranslates?.[language] ?? '',
    payload: payloadTranslates?.[language]
      ? (JSON.parse(payloadTranslates?.[language]) as Record<string, unknown>)
      : {
          type: '',
          data: '',
        },
    locale: language,
  }))
}

const buildUpdateTemplateBodiesForSMS = ({
  templateId,
  templateTranslatableItems,
  availableLanguages,
}: SMSTemplateRequestBodiesForUpdatingParams) => {
  const messageTranslates = getTranslations(templateTranslatableItems, SMSContentTypes.Message)

  return availableLanguages.map((language) => ({
    templateId: Number(templateId),
    message: messageTranslates?.[language] ?? '',
    locale: language,
  }))
}

const buildUpdateTemplateRequestBodies = ({
  templateId,
  templateTranslatableItems,
  availableLanguages,
  templateType,
  template,
}: TemplateRequestBodiesForUpdatingParams):
  | UpdateEmailTemplateRequestBody[]
  | UpdatePushTemplateRequestBody[]
  | UpdateInAppTemplateRequestBody[]
  | UpdateSMSTemplateRequestBody[] => {
  switch (templateType) {
    case MessageMediumTypes.Email:
      return buildUpdateTemplateBodiesForEmail({
        templateId,
        templateTranslatableItems,
        availableLanguages,
      })
    case MessageMediumTypes.Push:
      return buildUpdateTemplateBodiesForPush({
        templateId,
        templateTranslatableItems,
        availableLanguages,
        template,
      })
    case MessageMediumTypes.InApp:
      return buildUpdateTemplateBodiesForInApp({
        templateId,
        templateTranslatableItems,
        availableLanguages,
      })
    case MessageMediumTypes.SMS:
      return buildUpdateTemplateBodiesForSMS({
        templateId,
        templateTranslatableItems,
        availableLanguages,
      })
    default:
      throw new Error('Unsupported template type')
  }
}

const getTemplateFieldValueFromPushTemplate = (
  template: IterablePushTemplate,
  contentType: string,
) => {
  const splitContentType = contentType.split('_')
  const buttonNumber = parseInt(splitContentType[1]) - 1
  switch (splitContentType[0]) {
    case PushContentTypes.ButtonIdentifier:
      return template?.buttons?.[buttonNumber]?.identifier ?? ''
    case PushContentTypes.ButtonTitle:
      return template?.buttons?.[buttonNumber]?.title ?? ''
    case PushContentTypes.ButtonInputPlaceholder:
      return template?.buttons?.[buttonNumber]?.inputPlaceholder ?? ''
    case PushContentTypes.ButtonInputTitle:
      return template?.buttons?.[buttonNumber]?.inputTitle ?? ''
    default: {
      const value = template[contentType as keyof typeof template] ?? ''
      return isObject(value) ? JSON.stringify(value) : String(value)
    }
  }
}

const getTemplateFieldValue = ({
  template,
  contentType,
  templateType,
}: TemplateFieldValueParams) => {
  if (templateType == MessageMediumTypes.Push) {
    return getTemplateFieldValueFromPushTemplate(template as IterablePushTemplate, contentType)
  }
  const value = template[contentType as keyof typeof template] ?? ''
  return isObject(value) ? JSON.stringify(value) : String(value)
}

const buildItemWithTranslations = ({
  items,
  locales,
  translatableTemplates,
  templateType,
}: ItemWithTranslations) => {
  return items.map((item) => {
    const translations = locales.reduce((acc, locale) => {
      const template = translatableTemplates.find(
        (translatableTemplate) =>
          translatableTemplate?.locale === locale &&
          translatableTemplate?.templateId === Number(item.groupId),
      )
      return {
        ...acc,
        [locale]: template
          ? getTemplateFieldValue({
              template,
              templateType,
              contentType: item.metadata.contentType as string,
            })
          : '',
      }
    }, {})
    return { ...item, translations }
  })
}

const iterableMapper = {
  buildItemIdentifiersFromTemplates,
  buildCacheItemsFromTemplate,
  buildUpdateTemplateRequestBodies,
  buildItemWithTranslations,
}

export default iterableMapper
