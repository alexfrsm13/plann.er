import { prisma } from '@/lib/prisma'
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { dayjs } from '@/lib/dayjs'

export const updateTrip: FastifyPluginAsyncZod = async (app) => {
  app.put(
    '/trips/:tripId',
    {
      schema: {
        summary: 'Atualização do cadastro de uma nova viagem',
        tags: ['trips'],
        description:
          'Atualiza o cadastro de uma viagem existente através dos dados recebidos no corpo da requisição.',
        produces: ['application/json'],
        consumes: ['application/json'],
        params: z.object({
          tripId: z.uuid(),
        }),
        body: z
          .object({
            destination: z.string().min(4, {
              error: 'Destino deve possuir no mínimo 4 caracteres.',
            }),
            starts_at: z.coerce.date({ error: 'Data deve ser válida.' }),
            ends_at: z.coerce.date({ error: 'Data deve ser válida.' }),
          })
          .refine((data) => dayjs(data.starts_at).isAfter(new Date()), {
            error: 'Data de início deve ser maior que a data atual!',
          })
          .refine((data) => dayjs(data.ends_at).isAfter(data.starts_at), {
            error: 'Data de término deve ser maior que a data de início!',
          }),
        response: {
          200: z.object({
            id: z.string(),
          }),
          404: z.string(),
        },
      },
    },
    async (request, reply) => {
      const { destination, starts_at, ends_at } = request.body

      const { tripId } = request.params

      const trip = await prisma.trip.findUnique({
        where: {
          id: tripId,
        },
      })

      if (!trip) {
        return reply
          .status(404)
          .send(`Viagem de código ${tripId} não encontrada!`)
      }

      await prisma.trip.update({
        where: {
          id: tripId,
        },
        data: {
          destination,
          startsAt: starts_at,
          endsAt: ends_at,
        },
      })

      return reply.send({
        id: tripId,
      })
    },
  )
}
