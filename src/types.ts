import type z from 'zod'

import type { contentItem, itemIdentifiers } from './modules/commonSchemas'

export type ItemIdentifiers = z.infer<typeof itemIdentifiers>
export type ContentItem = z.infer<typeof contentItem>

export const isObject = (unknown: unknown): unknown is Record<PropertyKey, unknown> =>
  typeof unknown === 'object' && unknown !== null
export const isString = (unknown: unknown): unknown is string => typeof unknown === 'string'
export const hasMessage = (error: unknown): error is { message: unknown } =>
  isObject(error) && 'message' in error

export type IntegrationConfig = Record<string, unknown>
export type AuthConfig = Record<string, unknown>
