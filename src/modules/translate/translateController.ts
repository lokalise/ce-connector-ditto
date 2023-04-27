import type { FastifyRequest } from 'fastify'

import type { TranslateRequestBody, TranslateResponse } from './translateTypes'

export const getContent = async (
  req: FastifyRequest<{ Body: TranslateRequestBody }>,
  reply: TranslateResponse,
) => {
  const { translateService } = req.diScope.cradle

  const [items, updateItems] = await translateService.getContent(
    req.integrationConfig,
    req.authConfig,
    req.body.locales,
    req.body.items,
    req.body.defaultLocale,
  )

  await reply.send({ items, updateItems })
}
