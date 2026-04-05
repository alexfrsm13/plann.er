import { prisma } from '@/lib/prisma'
import { dayjs } from '@/lib/dayjs'
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const getActivities: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/trips/:tripId/activities',
    {
      schema: {
        summary: 'Lista os cadastros de atividades de uma viagem',
        tags: ['activities'],
        description:
          'Lista as atividades cadastradas em uma viagem existente através do identificador da viagem recebido como parâmetros de rota.',
        produces: ['application/json'],
        consumes: ['application/json'],
        params: z.object({
          tripId: z.string(),
        }),
        response: {
          200: z.array(
            z.object({
              date: z.date(),
              activities: z.array(
                z.object({
                  id: z.uuid(),
                  title: z.string(),
                  occurs_at: z.date(),
                }),
              ),
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
          activities: {
            select: {
              id: true,
              title: true,
              occursAt: true,
            },
            orderBy: {
              occursAt: 'asc',
            },
          },
        },
      })

      if (!trip) {
        return reply
          .status(404)
          .send(`Viagem de código ${tripId} não encontrada!`)
      }

      const differenceInDaysBetweenTripStartAndEnd = dayjs(trip.endsAt).diff(
        trip.startsAt,
        'days',
      )

      const activities = Array.from({
        length: differenceInDaysBetweenTripStartAndEnd + 1,
      }).map((_, index) => {
        const date = dayjs(trip.startsAt).add(index, 'days')

        const activitiesFiltred = trip.activities.filter((activity) => {
          return dayjs(activity.occursAt).isSame(date, 'day')
        })

        const response = activitiesFiltred.map((activity) => {
          return {
            id: activity.id,
            title: activity.title,
            occurs_at: activity.occursAt,
          }
        })

        return {
          date: date.toDate(),
          activities: response,
        }
      })

      return reply.send(activities)
    },
  )
}
