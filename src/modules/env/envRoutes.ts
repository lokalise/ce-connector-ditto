import type { Routes } from '../commonTypes'

import { getEnv } from './envController'
import { envResponseBody } from './envSchemas'

export const envRouteDefinition: Routes = [
  {
    method: 'GET',
    url: '/env',
    handler: getEnv,
    schema: {
      response: {
        200: envResponseBody,
      },
    },
  },
]
