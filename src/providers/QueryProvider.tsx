
import React from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

// This is the provider component
export default function QueryProvider({children}: {children: React.ReactNode;}) {
    const queryClient = new QueryClient()


    return (
        <QueryClientProvider client={queryClient}>


                {children}

        </QueryClientProvider>
    );
}