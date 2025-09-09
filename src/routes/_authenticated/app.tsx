// src/routes/app/index.tsx
import {createFileRoute, Outlet} from '@tanstack/react-router'
import LobbySidebar from "@/components/lobby/LobbySidebar.tsx";
import {deleteCookie, isAuthenticated} from "@/lib/cookieHelper.ts";
import {toast} from "sonner";


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
            console.log("user not authenticated...");
            toast.error("User not authenticated... please login");
            deleteCookie('token');
            setTimeout(() => {
                window.location.href = '/';
            }, 1500); // delay 1.5s
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
