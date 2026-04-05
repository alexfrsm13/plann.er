import { env } from '@/env'
import { prisma } from '@/lib/prisma'
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const confirmParticipant: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/participants/:participantId/confirm',
    {
      schema: {
        summary: 'Confirmar a participação na viagem',
        tags: ['participants'],
        description:
          'Confirma a participação de um participante em uma nova viagem através do e-mail enviado pelo criador da viagem.',
        produces: ['application/json'],
        consumes: ['application/json'],
        params: z.object({
          participantId: z.uuid(),
        }),
        return: {
          200: z.void(),
          204: z.string(),
        },
      },
    },
    async (request, reply) => {
      const { participantId } = request.params

      const participant = await prisma.participant.findUnique({
        where: {
          id: participantId,
        },
      })

      if (!participant) {
        return reply
          .status(404)
          .send(`Participante de ID ${participantId} não encontrado!`)
      }

      if (participant.isConfirmed) {
        return reply.redirect(
          `${env.FRONT_END_URL}/trips/${participant.tripId}`,
        )
      }

      await prisma.participant.update({
        where: {
          id: participantId,
        },
        data: {
          isConfirmed: true,
        },
      })

      return reply.redirect(`${env.FRONT_END_URL}/trips/${participant.tripId}`)
    },
  )
}
