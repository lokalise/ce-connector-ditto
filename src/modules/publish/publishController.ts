import type { FastifyRequest } from 'fastify'

import type { PublishRequestBody, PublishResponse } from './publishTypes'

export const publishContent = async (
  req: FastifyRequest<{ Body: PublishRequestBody }>,
  reply: PublishResponse,
) => {
  const { publishService } = req.diScope.cradle
  await publishService.publishContent(
    req.integrationConfig,
    req.authConfig,
    req.body.items,
    req.body.defaultLocale,
  )

  await reply.send({
    status: 200,
    message: 'Content successfully updated',
  })
}
