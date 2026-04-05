import { prisma } from '@/lib/prisma'
import { dayjs } from '@/lib/dayjs'
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const getLinks: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/trips/:tripId/links',
    {
      schema: {
        summary: 'Lista os cadastros de links de uma viagem',
        tags: ['links'],
        description:
          'Lista os links cadastrados em uma viagem existente através do identificador da viagem recebido como parâmetros de rota.',
        produces: ['application/json'],
        consumes: ['application/json'],
        params: z.object({
          tripId: z.string(),
        }),
        response: {
          200: z.array(
            z.object({
              id: z.uuid(),
              title: z.string(),
              url: z.url(),
            }),
          ),
          404: z.string(),
        },
      },
    },
    async (request, reply) => {
      const { tripId } = request.params

      const trip = await prisma.trip.findUnique({
        where: {
          id: tripId,
        },
        include: {
          links: {
            select: {
              id: true,
              title: true,
              url: true,
            },
          },
        },
      })

      if (!trip) {
        return reply
          .status(404)
          .send(`Viagem de código ${tripId} não encontrada!`)
      }

      const links = trip.links.map((link) => {
        return {
          id: link.id,
          title: link.title,
          url: link.url,
        }
      })

      return reply.send(links)
    },
  )
}
