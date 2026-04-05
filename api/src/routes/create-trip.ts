import { prisma } from '@/lib/prisma'
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { dayjs } from '@/lib/dayjs'
import { getMailClient } from '@/lib/mail'
import nodemailer from 'nodemailer'

export const createTrip: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/trips',
    {
      schema: {
        summary: 'Cadastro de uma nova viagem',
        tags: ['trips'],
        description:
          'Cadastra uma nova viagem através dos dados recebidos no corpo da requisição.',
        produces: ['application/json'],
        consumes: ['application/json'],
        body: z
          .object({
            destination: z.string().min(4, {
              error: 'Destino deve possuir no mínimo 4 caracteres.',
            }),
            starts_at: z.coerce.date({ error: 'Data deve ser válida.' }),
            ends_at: z.coerce.date({ error: 'Data deve ser válida.' }),
            owner_name: z
              .string()
              .min(3, { error: 'Nome deve ser maior que 3 caracteres.' }),
            owner_email: z.email({ error: 'E-mail deve ser válido!' }),
            emails_to_invite: z.array(
              z.email({ error: 'E-mail deve ser válido!' }),
            ),
          })
          .refine((data) => dayjs(data.starts_at).isAfter(new Date()), {
            error: 'Data de início deve ser maior que a data atual!',
          })
          .refine((data) => dayjs(data.ends_at).isAfter(data.starts_at), {
            error: 'Data de término deve ser maior que a data de início!',
          }),
        response: {
          201: z.object({
            id: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const {
        destination,
        starts_at,
        ends_at,
        owner_name,
        owner_email,
        emails_to_invite,
      } = request.body

      const trip = await prisma.trip.create({
        data: {
          destination,
          startsAt: starts_at,
          endsAt: ends_at,
          participants: {
            createMany: {
              data: [
                {
                  name: owner_name,
                  email: owner_email,
                  isOwner: true,
                  isConfirmed: true,
                },
                ...emails_to_invite.map((email) => {
                  return { email }
                }),
              ],
            },
          },
        },
      })

      const formattedStartDate = dayjs(starts_at).format('LL')
      const formattedEndDate = dayjs(ends_at).format('LL')

      const confirmationLink = `http://localhost:3333/trips/${trip.id}/confirm`

      const mail = await getMailClient()

      const message = await mail.sendMail({
        from: {
          name: 'Team plann.er',
          address: 'oi@plann.er',
        },
        to: {
          name: owner_name,
          address: owner_email,
        },
        subject: `Confirme sua viagem para ${destination}`,
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
              Você solicitou a criação de uma viagem para <strong>${destination}</strong>,
              Brasil nas datas de
              <strong style="color: #bef264">${formattedStartDate}</strong> até
              <strong style="color: #bef264">${formattedEndDate}</strong>.
            </p>

            <p></p>

            <p>Para confirmar sua viagem, clique no link abaixo:</p>

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
              >Confirmar viagem</a
            >

            <p></p>

            <p>
              Caso esteja usando o dispositivo móvel, você também pode confirmar a criação
              da viagem pelos aplicativos:
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

      return reply.status(201).send({
        id: trip.id,
      })
    },
  )
}
