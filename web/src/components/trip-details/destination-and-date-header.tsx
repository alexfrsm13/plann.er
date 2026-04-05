import { Calendar, MapPin, Settings2 } from 'lucide-react'
import { Button } from '../ui/button'
import { getRouteApi } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { api } from '../../lib/axios'
import { z } from 'zod'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const tripSchema = z.object({
  id: z.uuid(),
  destination: z.string(),
  starts_at: z.string(),
  ends_at: z.string(),
  is_confirmed: z.boolean(),
})

const route = getRouteApi('/trips/$id')

export function DestinationAndDateHeader() {
  const { id } = route.useParams()

  const { data: trip } = useSuspenseQuery({
    queryKey: ['trip', id],
    queryFn: async ({ signal }) => {
      const response = await api.get(`/trips/${id}`, { signal })
      return tripSchema.parse(response.data)
    },
  })

  const displayedDate = trip
    ? format(trip.starts_at, "d' de 'LLL", {
        locale: ptBR,
      })
        .concat(' até ')
        .concat(
          format(trip.ends_at, "d' de 'LLL", {
            locale: ptBR,
          }),
        )
    : null

  return (
    <div className="shadow-shape flex h-16 items-center justify-between rounded-xl bg-zinc-900 px-4">
      <div className="flex items-center gap-2">
        <MapPin className="size-5 text-zinc-400" />
        <span className="text-zinc-100">{trip.destination}</span>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <Calendar className="size-5 text-zinc-400" />
          <span className="text-zinc-100">{displayedDate}</span>
        </div>

        <div className="h-6 w-px bg-zinc-800" />

        <Button variant="secondary">
          Alterar local/data
          <Settings2 className="size-5" />
        </Button>
      </div>
    </div>
  )
}
