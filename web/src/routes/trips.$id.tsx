import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { CreateActivityModal } from '../components/trip-details/create-activity-modal'
import { ImportantLinks } from '../components/trip-details/important-links'
import { Guests } from '../components/trip-details/guests'
import { Activities } from '../components/trip-details/activities'
import { DestinationAndDateHeader } from '../components/trip-details/destination-and-date-header'
import { Button } from '../components/ui/button'

export const Route = createFileRoute('/trips/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isCreateActivityModalOpen, setIsCreateActivityModalOpen] =
    useState(false)

  function openCreateActivityModal() {
    setIsCreateActivityModalOpen(true)
  }

  function closeCreateActivityModal() {
    setIsCreateActivityModalOpen(false)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-10">
      <DestinationAndDateHeader />

      <main className="flex gap-16 px-4">
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[32px] font-semibold">Atividades</h2>
            <Button onClick={openCreateActivityModal}>
              <Plus className="size-5" />
              Cadastrar atividade
            </Button>{' '}
          </div>

          <Activities />
        </div>

        <div className="w-80 space-y-6">
          <ImportantLinks />

          <div className="h-px w-full bg-zinc-800" />

          <Guests />
        </div>
      </main>

      {isCreateActivityModalOpen && (
        <CreateActivityModal
          closeCreateActivityModal={closeCreateActivityModal}
        />
      )}
    </div>
  )
}
