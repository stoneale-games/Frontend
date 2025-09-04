import { createFileRoute } from '@tanstack/react-router'
import {GameTabs} from "@/components/lobby/gametabs/GameTabs.tsx";

export const Route = createFileRoute('/_authenticated/app/lobby')({
  component: RouteComponent,
})

function RouteComponent() {
  return  <div className="p-4 w-full">
      <main className="flex-1 p-6 bg-muted/40">
          <h1 className="text-3xl font-bold mb-4">Game Lobby</h1>
          <GameTabs />
      </main>
  </div>
}
