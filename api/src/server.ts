import path from 'node:path'
import fs from 'node:fs'

import { fastify } from 'fastify'
import {
  validatorCompiler,
  serializerCompiler,
  jsonSchemaTransform,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { fastifyCors } from '@fastify/cors'
import scalarApiReference from '@scalar/fastify-api-reference'

import { env } from '@/env'
import { createTrip } from './routes/create-trip'
import { confirmTrip } from './routes/confirm-trip'
import { confirmParticipant } from './routes/confirm-participant'
import { createActivity } from './routes/create-activity'
import { getActivities } from './routes/get-activities'
import { createLink } from './routes/create-link'
import { getLinks } from './routes/get-links'
import { getParticipants } from './routes/get-participants'
import { createInvite } from './routes/create-invite'
import { updateTrip } from './routes/update-trip'
import { getTripDetails } from './routes/get-trip-details'
import { getParticipant } from './routes/get-participant'

const logoPath = path.join(import.meta.dirname, 'docs/logo.png')
const logoBuffer = fs.readFileSync(logoPath)

const PORT = env.PORT

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
})

app.register(fastifySwagger, {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'plann.er API',
      description:
        'Especificações da API para o back-end da aplicação plann.er construída durante o NLW Journey da Rocketseat.',
      version: '1.0.0',
    },
    tags: [
      {
        name: 'trips',
        description: 'Endpoints relacionados a Viagens (trips)',
      },
      {
        name: 'participants',
        description: 'Endpoints relacionados a Participantes (participants)',
      },
      {
        name: 'activities',
        description: 'Endpoints relacionados a Atividades (activities)',
      },
      {
        name: 'links',
        description: 'Endpoints relacionados a Links (links)',
      },
      {
        name: 'invites',
        description: 'Endpoints relacionados a Convites (invites)',
      },
    ],
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs/v1',
  logo: {
    type: 'image/png',
    content: logoBuffer,
  },
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false,
  },
})

app.register(scalarApiReference, {
  routePrefix: '/docs/v2',
  configuration: {
    darkMode: true,
    theme: 'elysiajs',
    hideModels: true,
    hideDarkModeToggle: true,
    mcp: {
      disabled: true,
    },
    agent: {
      disabled: true,
    },
    pageTitle: 'plann.er API',
  },
})

app.register(createTrip)
app.register(confirmTrip)
app.register(confirmParticipant)
app.register(createActivity)
app.register(getActivities)
app.register(createLink)
app.register(getLinks)
app.register(getParticipants)
app.register(createInvite)
app.register(updateTrip)
app.register(getTripDetails)
app.register(getParticipant)

app
  .listen({
    port: PORT,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log(`🚀 Servidor executando na Porta ${PORT}!`)
    console.log(`🔥 Aplicação disponível em http://localhost:${PORT}`)
    console.log(
      `📕 Documentação V1 disponível em http://localhost:${PORT}/docs/v1`,
    )
    console.log(
      `📕 Documentação V2 disponível em http://localhost:${PORT}/docs/v2`,
    )
  })
