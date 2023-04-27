import type { FastifyRequest } from 'fastify'

import type { CacheRequestBody, CacheResponse, ListCacheResponse } from './cacheTypes'

export const getCache = async (req: FastifyRequest, reply: ListCacheResponse) => {
  const { cacheService } = req.diScope.cradle
  const items = await cacheService.listItems(req.integrationConfig, req.authConfig)

  await reply.send({
    items,
  })
}

export const getCacheItems = async (
  req: FastifyRequest<{ Body: CacheRequestBody }>,
  reply: CacheResponse,
) => {
  const { cacheService } = req.diScope.cradle
  const items = await cacheService.getItems(req.integrationConfig, req.authConfig, req.body.items)

  await reply.send({
    items,
  })
}
