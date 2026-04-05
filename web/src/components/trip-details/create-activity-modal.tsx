import { Calendar, Tag, X } from 'lucide-react'
import { Button } from '../ui/button'
import { api } from '../../lib/axios'
import { getRouteApi } from '@tanstack/react-router'

interface CreateActivityModal {
  closeCreateActivityModal: () => void
}

const route = getRouteApi('/trips/$id')

export function CreateActivityModal({
  closeCreateActivityModal,
}: CreateActivityModal) {
  const { id } = route.useParams()

  async function createActivity(formData: FormData) {
    const title = formData.get('title')?.toString()
    const occurs_at = formData.get('occurs_at')?.toString()

    await api.post(`/trips/${id}/activities`, {
      title,
      occurs_at,
    })

    window.document.location.reload()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60">
      <div className="shadow-shape w-160 space-y-5 rounded-xl bg-zinc-900 px-6 py-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Cadastrar atividade</h2>

            <button type="button" onClick={closeCreateActivityModal}>
              <X className="size-5 text-zinc-400" />
            </button>
          </div>

          <p className="text-sm text-zinc-400">
            Todos convidados podem visualizar as atividades.
          </p>
        </div>

        <form action={createActivity} className="space-y-3">
          <div className="flex h-14 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-4">
            <Tag className="size-5 text-zinc-400" />
            <input
              type="text"
              name="title"
              placeholder="Qual a atividade?"
              className="flex-1 bg-transparent text-lg placeholder-zinc-400 outline-none"
            />
          </div>

          <div className="flex h-14 flex-1 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-4">
            <Calendar className="size-5 text-zinc-400" />
            <input
              type="datetime-local"
              name="occurs_at"
              placeholder="Data e Horário da atividade"
              className="flex-1 bg-transparent text-lg placeholder-zinc-400 scheme-dark outline-none"
            />
          </div>

          <Button type="submit" size="full">
            Salvar atividade
          </Button>
        </form>
      </div>
    </div>
  )
}
