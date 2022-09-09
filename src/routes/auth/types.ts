import type z from 'zod'

import type { ApiReply } from '../types'

import type { getAuthResponseBody } from './schema'

export type GetAuthResponseBody = z.infer<typeof getAuthResponseBody>
export type GetAuthResponse = ApiReply<GetAuthResponseBody>

export type PostAuthRequestPayload = Record<string, unknown>
export type PostAuthRefreshRequestPayload = Record<string, unknown>

export type AuthResponseBody = Record<string, unknown>
export type AuthResponse = ApiReply<AuthResponseBody>

export type AuthRefreshResponse = ApiReply<AuthResponseBody>
