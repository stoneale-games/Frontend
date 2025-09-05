import { http, createConfig } from 'wagmi'
import { base, mainnet, /*optimism */} from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'

export const projectId = import.meta.env.VITE_PROJECT_ID

if(!projectId) {
    throw new Error("NEXT_PUBLIC_PROJECT_ID is not defined. Please set it in your environment variables.");
}


export const config = createConfig({
    chains: [mainnet, base],
    connectors: [
        injected(),
        walletConnect({ projectId }),
        metaMask(),
        safe(),
    ],
    transports: {
        [mainnet.id]: http(),
        [base.id]: http(),
    },
})