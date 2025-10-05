
import { createAppKit } from '@reown/appkit'
import { mainnet, arbitrum } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'


// 1. Get projectId from https://dashboard.reown.com
export const projectId = import.meta.env.VITE_PROJECT_ID

if(!projectId) {
    throw new Error("NEXT_PUBLIC_PROJECT_ID is not defined. Please set it in your environment variables.");
}

// 2. Create a metadata object - optional
const metadata = {
    name: 'Stoneale',
    description: 'Login Your Account',
    url: 'https://stoneale.com', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// 3. Set the networks
const networks = [mainnet, arbitrum]

// 4. Create Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
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
});