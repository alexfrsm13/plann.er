import { prisma } from '@/lib/prisma'
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const createLink: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/trips/:tripId/links',
    {
      schema: {
        summary: 'Cadastro de um novo link',
        tags: ['links'],
        description:
          'Cadastra um novo link em uma viagem existente através dos dados recebidos no corpo da requisição.',
        produces: ['application/json'],
        consumes: ['application/json'],
        params: z.object({
          tripId: z.string(),
        }),
        body: z.object({
          title: z.string().min(4, {
            error: 'Título deve possuir no mínimo 4 caracteres.',
          }),
          url: z.url({ error: 'URL do link deve ser válida!' }),
        }),
        response: {
          201: z.object({
            id: z.string(),
          }),
          404: z.string(),
        },
      },
    },
    async (request, reply) => {
      const { tripId } = request.params

      const { title, url } = request.body

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

      const link = await prisma.link.create({
        data: {
          title,
          url: url,
          tripId,
        },
      })

      return reply.status(201).send({
        id: link.id,
      })
    },
  )
}
