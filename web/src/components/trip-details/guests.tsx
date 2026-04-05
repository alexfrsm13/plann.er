import { CheckCircle2, CircleDashed, UserCog } from 'lucide-react'
import { Button } from '../ui/button'
import z from 'zod'
import { getRouteApi } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { api } from '../../lib/axios'

const participantSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  is_confirmed: z.boolean(),
})

const participantsSchema = z.array(participantSchema)

const route = getRouteApi('/trips/$id')

export function Guests() {
  const { id } = route.useParams()

  const { data: participants } = useSuspenseQuery({
    queryKey: ['trip', id, 'participants'],
    queryFn: async ({ signal }) => {
      const response = await api.get(`/trips/${id}/participants`, { signal })
      return participantsSchema.parse(response.data)
    },
  })

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Convidados</h2>

      <div className="space-y-5">
        {participants.map((participant, index) => {
          return (
            <div
              key={participant.id}
              className="flex items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <span className="block font-medium text-zinc-100">
                  {participant.name || `Convidado ${index}`}
                </span>

                <span className="block truncate text-sm text-zinc-400">
                  {participant.email}
                </span>
              </div>

              {participant.is_confirmed ? (
                <CheckCircle2 className="size-5 shrink-0 text-lime-300" />
              ) : (
                <CircleDashed className="size-5 shrink-0 text-zinc-400" />
              )}
            </div>
          )
        })}
      </div>

      <Button variant="secondary" size="full">
        <UserCog className="size-5" />
        Gerenciar convidados
      </Button>
    </div>
  )
}
