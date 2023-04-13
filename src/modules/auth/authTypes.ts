import type z from 'zod'

import type { ApiReply } from '../commonTypes'

import type { getAuthResponseBody } from './authSchemas'

export type GetAuthResponseBody = z.infer<typeof getAuthResponseBody>
export type GetAuthResponse = ApiReply<GetAuthResponseBody>

// url field is needed if OAuth flow used
export type PostAuthResponseBody = Record<string, unknown> & { url?: string }
export type PostAuthResponse = ApiReply<PostAuthResponseBody>

export type PostAuthRefreshResponse = ApiReply<PostAuthResponseBody>

export type PostAuthResultResponseBody = Record<string, unknown>
export type PostAuthResultResponse = ApiReply<PostAuthResultResponseBody>
