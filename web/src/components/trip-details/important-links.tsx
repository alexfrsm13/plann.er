import { Link2, Plus } from 'lucide-react'
import { Button } from '../ui/button'

export function ImportantLinks() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Links Importantes</h2>

      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="block font-medium text-zinc-100">
              Reserva do AirBnB
            </span>

            <a
              href="#"
              className="block truncate text-xs text-zinc-400 hover:text-zinc-200"
            >
              https://www.airbnb.com.br/rooms/1047000116564654887744665464467468
            </a>
          </div>

          <Link2 className="size-5 shrink-0 text-zinc-400" />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="block font-medium text-zinc-100">
              Reserva do AirBnB
            </span>

            <a
              href="#"
              className="block truncate text-xs text-zinc-400 hover:text-zinc-200"
            >
              https://www.airbnb.com.br/rooms/1047000116564654887744665464467468
            </a>
          </div>

          <Link2 className="size-5 shrink-0 text-zinc-400" />
        </div>
      </div>

      <Button variant="secondary" size="full">
        <Plus className="size-5" />
        Cadastrar novo link
      </Button>
    </div>
  )
}
