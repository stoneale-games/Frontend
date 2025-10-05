import type {ReactNode} from "react";
import {WagmiProvider} from "wagmi";
import {wagmiAdapter} from "@/lib/reown_app_kit_config.tsx";

export function AppKitProvider({ children }:{children:ReactNode}) {
    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig}>
            {children}
        </WagmiProvider>
    )
}