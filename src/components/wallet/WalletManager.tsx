
import {useAccount} from 'wagmi'

import {WalletStatus} from "@/components/wallet/WalletStatus.tsx";
import ConnectButt from "@/lib/ConnectButt.tsx";


// Main component with modal trigger
export function WalletManager() {
    const { isConnected } = useAccount();


    return (
        <div className="wallet-manager">
            {!isConnected ? (
                <ConnectButt/>
            ) : (
                <WalletStatus />
            )}
        </div>
    )
}



