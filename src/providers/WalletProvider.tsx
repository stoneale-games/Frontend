'use client';
import {type Config, cookieToInitialState, WagmiProvider} from "wagmi";
import {projectId, wagmiAdapter, wagmiConfig} from "@/lib/wagmi";
import type {ReactNode} from "react";
import {createAppKit} from "@reown/appkit";
import { mainnet, arbitrum } from '@reown/appkit/networks'

if(!projectId){
    throw new Error("VITE_PROJECT_ID is not defined. Please set it in your environment variables.");
}

const metadata = {
    name:"appkit",
    description:"Appkit Example - EVM",
    url: "/stoneal.com",
}

const modal = createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks: [mainnet,arbitrum],
    defaultNetwork: mainnet,
    features : {
        analytics:true,
        email: true,
        socials: ['google', 'x','github', 'discord','farcaster'],
        emailShowWallets:true
    }
})

export function WalletProvider({ children , cookies}: { children: ReactNode, cookies: string | null }) {
    const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)
    return (
           <WagmiProvider  config={wagmiConfig as Config} initialState={initialState}>
               {children}
           </WagmiProvider>
    );
}
