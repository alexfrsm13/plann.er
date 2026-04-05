import { prisma } from '@/lib/prisma'
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { dayjs } from '@/lib/dayjs'

export const createActivity: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/trips/:tripId/activities',
    {
      schema: {
        summary: 'Cadastro de uma nova atividade',
        tags: ['activities'],
        description:
          'Cadastra uma nova atividade em uma viagem existente através dos dados recebidos no corpo da requisição.',
        produces: ['application/json'],
        consumes: ['application/json'],
        params: z.object({
          tripId: z.string(),
        }),
        body: z.object({
          title: z.string().min(4, {
            error: 'Título deve possuir no mínimo 4 caracteres.',
          }),
          occurs_at: z.coerce.date({ error: 'Data deve ser válida.' }),
        }),
        response: {
          201: z.object({
            id: z.string(),
          }),
          400: z.string(),
          404: z.string(),
        },
      },
    },
    async (request, reply) => {
      const { tripId } = request.params

      const { title, occurs_at } = request.body

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

      if (dayjs(occurs_at).isBefore(trip.startsAt)) {
        return reply
          .status(400)
          .send(
            'Data da Atividade deve ser depois da data do início da viagem!',
          )
      }

      if (dayjs(occurs_at).isAfter(trip.endsAt)) {
        return reply
          .status(400)
          .send('Data da Atividade deve ser antes da data final da viagem!')
      }

      const activity = await prisma.activity.create({
        data: {
          title,
          occursAt: occurs_at,
          tripId,
        },
      })

      return reply.status(201).send({
        id: activity.id,
      })
    },
  )
}
