import { prisma } from '@/lib/prisma'
import { dayjs } from '@/lib/dayjs'
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { getMailClient } from '@/lib/mail'
import nodemailer from 'nodemailer'
import { env } from '@/env'

export const createInvite: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/trips/:tripId/invites',
    {
      schema: {
        summary: 'Envio de um convite para uma viagem',
        tags: ['invites'],
        description:
          'Envia um novo convite para um novo participante de uma viagem existente através dos dados recebidos no corpo da requisição.',
        produces: ['application/json'],
        consumes: ['application/json'],
        params: z.object({
          tripId: z.string(),
        }),
        body: z.object({
          email: z.email({ error: 'Email deve ser válido!' }),
        }),
        response: {
          201: z.void(),
          404: z.string(),
        },
      },
    },
    async (request, reply) => {
      const { tripId } = request.params

      const { email } = request.body

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

      const participant = await prisma.participant.create({
        data: {
          email,
          tripId,
        },
      })

      const formattedStartDate = dayjs(trip.startsAt).format('LL')
      const formattedEndDate = dayjs(trip.endsAt).format('LL')

      const mail = await getMailClient()

      const confirmationLink = `http://localhost:3333/participants/${participant.id}/confirm`

      const message = await mail.sendMail({
        from: {
          name: 'Team plann.er',
          address: 'oi@plann.er',
        },
        to: participant.email,
        subject: `Confirme sua presença na viagem ${trip.destination}`,
        html: `
            <div
                style="
                    font-family: sans-serif;
                    font-size: 16px;
                    line-height: 1.6;
                    background-color: #09090b;
                    color: #fafafa;
                "
            >
                <p>
                    Você foi convidado(a) para participar de uma viagem para <strong>${trip.destination}</strong>,
                    nas datas de
                    <strong style="color: #bef264">${formattedStartDate}</strong> até
                    <strong style="color: #bef264">${formattedEndDate}</strong>.
                </p>
                
                <p></p>
                
                <p>Para confirmar sua presença na viagem, clique no link abaixo:</p>
                
                <p></p>
                
                <a
                    href="${confirmationLink}"
                    style="
                        display: block;
                        width: 150px;
                        text-decoration: none;
                        text-align: center;
                        font-weight: bold;
                        color: #18181b;
                        padding: 5px;
                        border-radius: 4px;
                        background-color: #bef264;
                    "
                >Confirmar viagem</a>
                
                <p></p>
                
                <p>
                    Caso esteja usando o dispositivo móvel, você também pode confirmar a sua presença
                    na viagem pelos aplicativos:
                </p>
                
                <p></p>
                
                <a
                    href="#"
                    style="
                        display: flex;
                        width: 150px;
                        text-decoration: none;
                        font-weight: bold;
                        align-items: center;
                        justify-items: center;
                        color: #18181b;
                        padding: 5px;
                        border-radius: 4px;
                        background-color: #bef264;
                    "
                >
                    <img
                        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXNtYXJ0cGhvbmUtaWNvbiBsdWNpZGUtc21hcnRwaG9uZSI+PHJlY3Qgd2lkdGg9IjE0IiBoZWlnaHQ9IjIwIiB4PSI1IiB5PSIyIiByeD0iMiIgcnk9IjIiLz48cGF0aCBkPSJNMTIgMThoLjAxIi8+PC9zdmc+"
                        alt="Smartphone"
                        style="margin-right: 10px"
                    />
                    <span style="margin-right: 20px">Android</span>
                    <span>iOS</span>
                </a>
                
                <p></p>
                
                <p>
                    Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.
                </p>
            </div>        
        `.trim(),
      })

      console.log(nodemailer.getTestMessageUrl(message))

      return reply.redirect(`${env.FRONT_END_URL}/trips/${tripId}`)
    },
  )
}
