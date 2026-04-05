import { prisma } from '@/lib/prisma'
import { dayjs } from '@/lib/dayjs'
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { truncate } from 'node:fs'

export const getTripDetails: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/trips/:tripId',
    {
      schema: {
        summary: 'Busca os dados de uma viagem',
        tags: ['trips'],
        description:
          'Lista os dados cadastros de uma viagem existente através do identificador da viagem recebido como parâmetros de rota.',
        produces: ['application/json'],
        consumes: ['application/json'],
        params: z.object({
          tripId: z.string(),
        }),
        response: {
          200: z.object({
            id: z.uuid(),
            destination: z.string(),
            starts_at: z.date(),
            ends_at: z.date(),
            is_confirmed: z.boolean(),
            created_at: z.date(),
          }),
          404: z.string(),
        },
      },
    },
    async (request, reply) => {
      const { tripId } = request.params

      const trip = await prisma.trip.findUnique({
        select: {
          id: true,
          destination: true,
          startsAt: true,
          endsAt: true,
          isConfirmed: true,
          createdAt: true,
        },
        where: {
          id: tripId,
        },
      })

      if (!trip) {
        return reply
          .status(404)
          .send(`Viagem de código ${tripId} não encontrada!`)
      }

      const response = {
        id: trip.id,
        destination: trip.destination,
        starts_at: trip.startsAt,
        ends_at: trip.endsAt,
        is_confirmed: trip.isConfirmed,
        created_at: trip.createdAt,
      }

      return reply.send(response)
    },
  )
}
