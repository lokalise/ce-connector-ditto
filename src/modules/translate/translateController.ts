import type { FastifyRequest } from 'fastify'

import type { TranslateRequestBody, TranslateResponse } from './translateTypes'

export const getContent = async (
  req: FastifyRequest<{ Body: TranslateRequestBody }>,
  reply: TranslateResponse,
) => {
  const { translateService } = req.diScope.cradle

  const originalLocalesMap = new Map<string, string>()
  req.body.locales.forEach((locale) => {
    const lowerCased = locale !== req.body.defaultLocale ? locale.toLowerCase() : locale
    originalLocalesMap.set(lowerCased, locale)
  })

  const [items, updateItems] = await translateService.getContent(
    req.integrationConfig,
    req.authConfig,
    req.body.items,
    req.body.defaultLocale,
    originalLocalesMap,
  )

  await reply.send({ items, updateItems })
}
