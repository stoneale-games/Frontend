// src/routes/app/index.tsx
import {createFileRoute, Outlet, redirect} from '@tanstack/react-router'
import LobbySidebar from "@/components/lobby/LobbySidebar.tsx";
import {isAuthenticated} from "@/lib/cookieHelper.ts";


export const Route = createFileRoute('/_authenticated/app')({
    beforeLoad: () => {
        //ctx
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      /*  // @ts-expect-error*/
      /*  if (!ctx.context.auth.isAuthenticated) {
            console.log('❌ No token found, redirecting to login')
            throw redirect({
                to: '/',
                search: { redirect: location.href },
            })
        }*/

        if (!isAuthenticated()) {
            console.log("user not authenticated...")

            const url = new URL(window.location.href)
            url.searchParams.delete("redirect") // remove any existing redirect param

            throw redirect({
                to: '/',
                search: {
                    redirect: url.pathname + url.search, // only clean path + other params
                },
            })
        }

    },
    component: () => (
        <div className="flex h-screen">
            {/* LobbySidebar */}
            <LobbySidebar />
            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto">
                <Outlet />
            </main>
        </div>
    ),
})
