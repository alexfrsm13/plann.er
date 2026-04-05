import z from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.url({ error: 'URL do Banco de Dados é obrigatória!' }),
  FRONT_END_URL: z.url().default('http://localhost:3000'),
})

export const env = envSchema.parse(process.env)
