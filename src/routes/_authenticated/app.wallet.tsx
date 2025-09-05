import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/app/wallet')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="p-4 w-full">
      <main className="flex-1 p-6 bg-muted/40">
          <h1 className="text-3xl font-bold mb-4">Wallet</h1>

          <section className={"flex w-full"}>
             <h1>Coming Soon..</h1>
          </section>

      </main>
  </div>
}
