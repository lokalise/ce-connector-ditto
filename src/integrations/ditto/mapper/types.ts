import type { CacheResponseBody } from 'src/modules/cache/cacheTypes'
import type { ContentItem, ItemIdentifiers } from 'src/types'

import type {
  IterableEmailTemplate,
  IterableInAppTemplate,
  IterablePushTemplate,
  IterableSMSTemplate,
  IterableTemplatesListItem,
} from '../client/types'

export type CacheResponseBodyItems = CacheResponseBody['items']
export type CacheResponseBodyItem = CacheResponseBodyItems[0]
export type CacheResponseBodyItemField = {
  templateId: number
  updated: string
  creator: string
  templateType: string
}

export enum EmailContentTypes {
  Subject = 'subject',
  PreheaderText = 'preheaderText',
  Html = 'html',
}

export enum EmailContentTitles {
  subject = 'Subject',
  preheaderText = 'Preheader text',
  html = 'Html',
}

export enum PushContentTypes {
  Payload = 'payload',
  Title = 'title',
  Message = 'message',
  ButtonTitle = 'buttonTitle',
  ButtonIdentifier = 'buttonIdentifier',
  ButtonInputTitle = 'buttonInputTitle',
  ButtonInputPlaceholder = 'buttonInputPlaceholder',
}

export enum PushContentTitles {
  payload = 'Payload',
  title = 'Title',
  message = 'Message',
  buttonTitle_1 = 'Title of the first button',
  buttonIdentifier_1 = 'Identifier of the first button',
  buttonInputTitle_1 = 'Input title of the first button',
  buttonInputPlaceholder_1 = 'Input placeholder of the first button',
  buttonTitle_2 = 'Title of the second button',
  buttonIdentifier_2 = 'Identifier of the second button',
  buttonInputTitle_2 = 'Input title of the second button',
  buttonInputPlaceholder_2 = 'Input placeholder of the second button',
  buttonTitle_3 = 'Title of the third button',
  buttonIdentifier_3 = 'Identifier of the third button',
  buttonInputTitle_3 = 'Input title of the third button',
  buttonInputPlaceholder_3 = 'Input placeholder of the third button',
}

export enum InAppContentTypes {
  Html = 'html',
  Payload = 'payload',
}

export enum InAppContentTitles {
  html = 'Html',
  payload = 'Payload',
}

export enum SMSContentTypes {
  Message = 'message',
}

export enum SMSContentTitles {
  message = 'Message',
}

export type ItemWithTranslations = {
  items: ItemIdentifiers[]
  locales: string[]
  translatableTemplates: (
    | IterableEmailTemplate
    | IterableInAppTemplate
    | IterablePushTemplate
    | IterableSMSTemplate
    | undefined
  )[]
  templateType: string
}

export type TemplateFieldValueParams = {
  template:
    | IterableEmailTemplate
    | IterableInAppTemplate
    | IterablePushTemplate
    | IterableSMSTemplate
  contentType: string
  templateType: string
}

export type TemplateRequestBodiesForUpdatingParams = {
  templateId: string
  templateTranslatableItems: ContentItem[]
  availableLanguages: string[]
  templateType: string
  template?: IterablePushTemplate
}

export type EmailTemplateRequestBodiesForUpdatingParams = {
  templateId: string
  templateTranslatableItems: ContentItem[]
  availableLanguages: string[]
}

export type InAppTemplateRequestBodiesForUpdatingParams =
  EmailTemplateRequestBodiesForUpdatingParams
export type SMSTemplateRequestBodiesForUpdatingParams = EmailTemplateRequestBodiesForUpdatingParams

export type PushTemplateRequestBodiesForUpdatingParams = {
  templateId: string
  templateTranslatableItems: ContentItem[]
  availableLanguages: string[]
  template?: IterablePushTemplate
}

export type ItemIdentifiersFromTemplates = {
  templates: IterableTemplatesListItem[]
  objectType: string
  pushTemplates?: IterablePushTemplate[]
}

export type TranslationsForButtonsParams = {
  availableLanguages: string[]
  template?: IterablePushTemplate
  templateTranslatableItems: ContentItem[]
}

export type ContentItemsTranslationsByLanguageAndContentTypeParams = {
  templateTranslatableItems: ContentItem[]
  contentType: string
  language: string
}
