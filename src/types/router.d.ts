import type { router } from '@/main' // adjust path if needed

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}
