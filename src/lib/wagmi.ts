import { mainnet, arbitrum } from '@reown/appkit/networks'
import {WagmiAdapter} from "@reown/appkit-adapter-wagmi";
import {cookieStorage, createStorage} from "wagmi";

export const projectId = import.meta.env.VITE_PROJECT_ID

if(!projectId) {
    throw new Error("NEXT_PUBLIC_PROJECT_ID is not defined. Please set it in your environment variables.");
}

export const networks = [mainnet,arbitrum]

export const wagmiAdapter = new WagmiAdapter({
    storage: createStorage({
        storage: cookieStorage
    }),
    ssr:true,
    networks,
    projectId
})

export const wagmiConfig  = wagmiAdapter.wagmiConfig;