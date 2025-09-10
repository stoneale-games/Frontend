
import { WagmiProvider } from 'wagmi'
import { createAppKit } from '@reown/appkit'
import { mainnet, arbitrum } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import type {ReactNode} from "react";

// 1. Get projectId from https://dashboard.reown.com
const projectId = 'YOUR_PROJECT_ID'

// 2. Create a metadata object - optional
const metadata = {
    name: 'AppKit',
    description: 'AppKit Example',
    url: 'https://example.com', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// 3. Set the networks
const networks = [mainnet, arbitrum]

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
    networks,
    projectId,
    ssr: true
})

// 5. Create modal
createAppKit({
    adapters: [wagmiAdapter],
    networks:[mainnet,arbitrum],
    projectId,
    metadata,
    features: {
        analytics: true // Optional - defaults to your Cloud configuration
    }
})

export function AppKitProvider({ children }:{children:ReactNode}) {
    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig}>
            {children}
        </WagmiProvider>
    )
}