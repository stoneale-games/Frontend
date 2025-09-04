"use client";

import { WalletProvider } from "./WalletProvider";
import QueryProvider from "./QueryProvider";
import {Provider} from "urql";
import {urqlClient} from "@/lib/urqlClient";
import {Toaster} from "@/components/ui/sonner.tsx";
import React from "react";

export default function Providers({ children,cookies }: { children: React.ReactNode , cookies:string|null}) {
    return (
        <QueryProvider>
               <Provider value={urqlClient}>
                   <WalletProvider cookies={cookies}>
                       {children}
                   </WalletProvider>
               </Provider>

            <Toaster
                position="top-right"
                toastOptions={{
                    classNames: {
                        toast: "rounded-xl border shadow-lg",   // applies to all
                        success: "bg-green-600 text-white",     // success only
                        error: "bg-red-600 text-white",         // error only
                    },
                }}
            />
        </QueryProvider>
    );
}
