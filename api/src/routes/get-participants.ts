import { prisma } from '@/lib/prisma'
import { dayjs } from '@/lib/dayjs'
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { TripScalarFieldEnum } from '@generated/prisma/internal/prismaNamespace'

export const getParticipants: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/trips/:tripId/participants',
    {
      schema: {
        summary: 'Lista os participantes de uma viagem',
        tags: ['participants'],
        description:
          'Lista os participantes de uma viagem existente através do identificador da viagem recebido como parâmetros de rota.',
        produces: ['application/json'],
        consumes: ['application/json'],
        params: z.object({
          tripId: z.string(),
        }),
        response: {
          200: z.array(
            z.object({
              id: z.uuid(),
              name: z.string(),
              email: z.email(),
              is_confirmed: z.boolean(),
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
          participants: {
            select: {
              id: true,
              name: true,
              email: true,
              isConfirmed: true,
            },
          },
        },
      })

      if (!trip) {
        return reply
          .status(404)
          .send(`Viagem de código ${tripId} não encontrada!`)
      }

      const participants = trip.participants.map((participant) => {
        return {
          id: participant.id,
          name: participant.name ?? '',
          email: participant.email,
          is_confirmed: participant.isConfirmed,
        }
      })

      return reply.send(participants)
    },
  )
}
