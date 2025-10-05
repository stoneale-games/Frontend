import { createFileRoute } from '@tanstack/react-router'
import {SettingsTabs} from "@/components/settings/SettingsTabs.tsx";

export const Route = createFileRoute('/_authenticated/app/settings')({
    component: RouteComponent,
})

function RouteComponent() {
   return (
       <main className="  p-6 bg-muted/40">
           <h1 className="text-3xl font-bold mb-4">Settings</h1>
           <SettingsTabs/>
       </main>
   )
}
