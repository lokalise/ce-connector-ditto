import type { ItemIdentifiers } from 'src/types'

import type {
  IterableEmailTemplate,
  IterableInAppTemplate,
  IterablePushTemplate,
  IterableSMSTemplate,
} from './client/types'

export interface LocaleDefinition {
  name: string
  code: string
}

export interface LocalesAvailable {
  defaultLocale: LocaleDefinition['code']
  locales: LocaleDefinition[]
}

export interface CacheItemStructure extends Record<string, string> {
  templateId: string
  updated: string
  creator: string
  templateType: string
}

export type TemplateItemsByTemplateTypeParams = {
  templateType: string
  key: string
  templates: (
    | IterableEmailTemplate
    | IterableInAppTemplate
    | IterablePushTemplate
    | IterableSMSTemplate
  )[]
  items: ItemIdentifiers[]
}

export type TranslatableTemplatesParams = {
  templateIds: string[]
  locales: string[]
  apiKey: string
  templateType: string
}
