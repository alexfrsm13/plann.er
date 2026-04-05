import { AtSign, Plus, X } from 'lucide-react'
import { Button } from '../ui/button'

interface InviteGuestsModalProps {
  closeGuestsModal: () => void
  emailsToInvite: string[]
  addToEmailToInvite: (formData: FormData) => void
  removeEmailFromInvites: (email: string) => void
}

export function InviteGuestsModal({
  closeGuestsModal,
  emailsToInvite,
  addToEmailToInvite,
  removeEmailFromInvites,
}: InviteGuestsModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60">
      <div className="shadow-shape w-160 space-y-5 rounded-xl bg-zinc-900 px-6 py-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Selecionar convidados</h2>

            <button type="button" onClick={closeGuestsModal}>
              <X className="size-5 text-zinc-400" />
            </button>
          </div>

          <p className="text-sm text-zinc-400">
            Os convidados irão receber e-mails para confirmar a participação na
            viagem.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {emailsToInvite.map((email) => {
            return (
              <div
                key={email}
                className="flex items-center gap-2 rounded-md bg-zinc-800 px-2.5 py-1.5"
              >
                <span className="text-zinc-300">{email}</span>
                <button
                  type="button"
                  onClick={() => removeEmailFromInvites(email)}
                >
                  <X className="size-4 text-zinc-400" />
                </button>
              </div>
            )
          })}
        </div>

        <div className="h-px w-full bg-zinc-800" />

        <form
          action={addToEmailToInvite}
          className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 p-2.5"
        >
          <div className="flex flex-1 items-center gap-2 px-2">
            <AtSign className="size-4 text-zinc-400" />
            <input
              type="email"
              name="email"
              placeholder="Digite o e-mail do convidado"
              className="flex-1 bg-transparent text-lg placeholder-zinc-400 outline-none"
            />
          </div>

          <Button type="submit">
            Convidar
            <Plus className="size-5" />
          </Button>
        </form>
      </div>
    </div>
  )
}
