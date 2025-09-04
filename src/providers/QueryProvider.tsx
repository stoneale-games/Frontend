"use client";

import React, {useState} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

// This is the provider component
export default function QueryProvider({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {
    // Use useState to ensure the QueryClient is only created once.
    // This is a best practice to avoid re-creating the api on every render.
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // It'new-chat a good idea to set some default staleTime
                        // to avoid unnecessary refetching immediately.
                        staleTime: 60 * 1000, // 1 minute
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>


                {children}

        </QueryClientProvider>
    );
}