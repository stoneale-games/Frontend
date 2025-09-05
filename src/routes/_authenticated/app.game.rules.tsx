import {createFileRoute} from '@tanstack/react-router'
import {RulesTabs} from "@/components/rules/RulesTabs.tsx";

export const Route = createFileRoute('/_authenticated/app/game/rules')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className="p-4 w-full">
            <main className="flex-1 p-6 bg-muted/40">
                <h1 className="text-3xl font-bold mb-4">Read Rules</h1>
                <RulesTabs/>
            </main>
        </div>
    )
}
