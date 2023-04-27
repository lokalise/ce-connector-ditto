import type { Routes } from '../commonTypes'

import { getCache, getCacheItems } from './cacheController'
import { cacheRequestBody, cacheResponseBody, listCacheResponseBody } from './cacheSchemas'

export const cacheRouteDefinition: Routes = [
  {
    method: 'GET',
    url: '/cache',
    handler: getCache,
    schema: {
      response: {
        200: listCacheResponseBody,
      },
    },
  },
  {
    method: 'POST',
    url: '/cache/items',
    handler: getCacheItems,
    schema: {
      body: cacheRequestBody,
      response: {
        200: cacheResponseBody,
      },
    },
  },
]
