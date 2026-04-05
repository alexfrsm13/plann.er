import { getRouteApi } from '@tanstack/react-router'
import { CircleCheck } from 'lucide-react'
import z from 'zod'
import { api } from '../../lib/axios'
import { useSuspenseQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const activitySchema = z.object({
  id: z.uuid(),
  title: z.string(),
  occurs_at: z.coerce.date(),
})

const activitiesSchema = z.array(activitySchema)

const responseObjectSchema = z.object({
  date: z.coerce.date(),
  activities: activitiesSchema,
})

const responseSchema = z.array(responseObjectSchema)

const route = getRouteApi('/trips/$id')

export function Activities() {
  const { id } = route.useParams()

  const { data: activities } = useSuspenseQuery({
    queryKey: ['trip', id, 'activities'],
    queryFn: async ({ signal }) => {
      const response = await api.get(`/trips/${id}/activities`, { signal })
      return responseSchema.parse(response.data)
    },
  })

  return (
    <div className="space-y-8">
      {activities.map((category, index) => {
        return (
          <div key={index} className="space-y-2.5">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-semibold text-zinc-300">
                Dia {format(category.date, 'd', { locale: ptBR })}
              </span>
              <span className="text-sm text-zinc-500">
                {format(category.date, 'EEEE', { locale: ptBR })}
              </span>
            </div>

            {category.activities.length > 0 ? (
              <div>
                {category.activities.map((activity) => {
                  return (
                    <div key={activity.id} className="space-y-2.5">
                      <div className="shadow-shape flex items-center gap-3 rounded-xl bg-zinc-900 px-4 py-2.5">
                        <CircleCheck className="size-5 text-lime-300" />
                        <span className="text-zinc-100">{activity.title}</span>
                        <span className="ml-auto text-sm text-zinc-400">
                          {format(activity.occurs_at, 'HH:MM', {
                            locale: ptBR,
                          })}
                          h
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">
                Nenhuma atividade cadastrada nessa data.
              </p>
            )}
          </div>
        )
      })}

      <div className="space-y-2.5">
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-semibold text-zinc-300">Dia 17</span>
          <span className="text-sm text-zinc-500">Sábado</span>
        </div>

        <p className="text-sm text-zinc-500">
          Nenhuma atividade cadastrada nessa data.
        </p>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-semibold text-zinc-300">Dia 18</span>
          <span className="text-sm text-zinc-500">Domingo</span>
        </div>

        <div className="space-y-2.5">
          <div className="shadow-shape flex items-center gap-3 rounded-xl bg-zinc-900 px-4 py-2.5">
            <CircleCheck className="size-5 text-lime-300" />
            <span className="text-zinc-100">Academia em grupo</span>
            <span className="ml-auto text-sm text-zinc-400">08:00h</span>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="shadow-shape flex items-center gap-3 rounded-xl bg-zinc-900 px-4 py-2.5">
            <CircleCheck className="size-5 text-lime-300" />
            <span className="text-zinc-100">Academia em grupo</span>
            <span className="ml-auto text-sm text-zinc-400">08:00h</span>
          </div>
        </div>
      </div>
    </div>
  )
}
