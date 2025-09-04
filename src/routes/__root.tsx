import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

function RootErrorComponent({ error }: { error: Error }) {
    return (
        <div className="p-4 text-red-600">
            <h1>Something went wrong!</h1>
            <pre>{error.message}</pre>
        </div>
    )
}

export const Route = createRootRoute({
    component: () => (
        <>
            {/* Your nav can stay here */}
            <Outlet />
            <TanStackRouterDevtools />
        </>
    ),
    errorComponent: RootErrorComponent, // ✅ Add this
})
