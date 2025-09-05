'use client';
import { WagmiProvider} from "wagmi";
import {projectId} from "@/lib/wagmi";
import type {ReactNode} from "react";
import {config} from "@/lib/config.ts";


if(!projectId){
    throw new Error("VITE_PROJECT_ID is not defined. Please set it in your environment variables.");
}



export function WalletProvider({ children }: { children: ReactNode }) {

    return (
           <WagmiProvider  config={config}>
               {children}
           </WagmiProvider>
    );
}
