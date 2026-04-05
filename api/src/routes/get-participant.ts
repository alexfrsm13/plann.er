import { prisma } from '@/lib/prisma'
import { dayjs } from '@/lib/dayjs'
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { TripScalarFieldEnum } from '@generated/prisma/internal/prismaNamespace'

export const getParticipant: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/participants/:participantId',
    {
      schema: {
        summary: 'Busca os dados do participante de uma viagem',
        tags: ['participants'],
        description:
          'Busca os dados do participante através do identificador do participante recebido como parâmetro de rota.',
        produces: ['application/json'],
        consumes: ['application/json'],
        params: z.object({
          participantId: z.string(),
        }),
        response: {
          200: z.object({
            id: z.uuid(),
            name: z.string(),
            email: z.email(),
            is_confirmed: z.boolean(),
          }),
          404: z.string(),
        },
      },
    },
    async (request, reply) => {
      const { participantId } = request.params

      const participant = await prisma.participant.findUnique({
        select: {
          id: true,
          name: true,
          email: true,
          isConfirmed: true,
        },
        where: {
          id: participantId,
        },
      })

      if (!participant) {
        return reply
          .status(404)
          .send(`Participante de código ${participantId} não encontrada!`)
      }

      const response = {
        id: participant.id,
        name: participant.name ?? '',
        email: participant.email,
        is_confirmed: participant.isConfirmed,
      }

      return reply.send(response)
    },
  )
}
