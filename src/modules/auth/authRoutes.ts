import type { Routes } from '../commonTypes'

import { getAuth, postAuth, postAuthRefresh } from './authController'
import { getAuthResponseBody, postAuthResponseBody } from './authSchemas'

export const authRouteDefinition: Routes = [
  {
    method: 'GET',
    url: '/auth',
    handler: getAuth,
    schema: {
      response: {
        200: getAuthResponseBody,
      },
    },
  },
  {
    method: 'POST',
    url: '/auth',
    handler: postAuth,
    schema: {
      response: {
        200: postAuthResponseBody,
      },
    },
  },
  {
    method: 'POST',
    url: '/auth/refresh',
    handler: postAuthRefresh,
    schema: {
      response: {
        200: postAuthResponseBody,
      },
    },
  },
]
