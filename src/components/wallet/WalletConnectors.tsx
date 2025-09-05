// Wallet connection options component
import {type Connector, useConnect} from "wagmi";
import {useCallback} from "react";
import {WalletOption} from "@/components/wallet/WalletOptions.tsx";

export function WalletConnectors({ onConnect }: { onConnect?: () => void }) {
    const { connectors, connect, isPending } = useConnect()

    const handleConnect = useCallback(async (connector: Connector) => {
        try {
            await connect({ connector });
            onConnect?.(); // Close modal after successful connection
        } catch (error) {
            console.error('Connection failed:', error);
        }
    }, [connect, onConnect]);

    return (
        <div className="space-y-3">
            {connectors.map((connector) => (
                <WalletOption
                    key={connector.uid}
                    connector={connector}
                    onClick={() => handleConnect(connector)}
                    isPending={isPending}
                />
            ))}
            <p className="text-xs text-muted-foreground text-center mt-4">
                By connecting a wallet, you agree to our Terms of Service
            </p>
        </div>
    )
}