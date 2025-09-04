import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import "./index.css";

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import {type AuthContext, createAuthContext, getAllCookiesAsString} from "@/lib/cookieHelper.ts";
import Providers from "@/providers/Providers.tsx";

// Create a new router instance
const router = createRouter({
    routeTree,
    context: {
        auth: createAuthContext() as AuthContext , // Now synchronous
    },
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

const string = getAllCookiesAsString();
// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
        <StrictMode>
            <Providers cookies={string}>
                <RouterProvider router={router} />
            </Providers>

        </StrictMode>,
    )
}