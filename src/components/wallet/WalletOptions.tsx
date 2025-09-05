import type {Connector} from "wagmi";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {Loader2} from "lucide-react";


// Wallet icon mapping - you can extend this
const getWalletIcon = (connectorName: string) => {
    const name = connectorName.toLowerCase();

    // You can replace these with actual wallet icons or use a library like @web3-react/walletconnect-connector
    if (name.includes('metamask')) {
        return '🦊'; // You can replace with actual MetaMask icon
    }
    if (name.includes('walletconnect')) {
        return '🔗';
    }
    if (name.includes('coinbase')) {
        return '🟦';
    }
    if (name.includes('injected')) {
        return '💉';
    }
    return '👛'; // Default wallet icon
};


// Individual wallet option component
export function WalletOption({
                          connector,
                          onClick,
                          isPending
                      }: {
    connector: Connector;
    onClick: () => void;
    isPending: boolean;
}) {
    const [ready, setReady] = useState(false)

    useEffect(() => {
        (async () => {
            try {
                const provider = await connector.getProvider()
                setReady(!!provider)
            } catch (error) {
                console.error('Failed to get provider:', error);
                setReady(false);
            }
        })()
    }, [connector])

    return (
        <Button
            variant="outline"
            className="w-full justify-start gap-3 h-14 text-left"
            disabled={!ready || isPending}
            onClick={onClick}
        >
            <div className="text-2xl">
                {getWalletIcon(connector.name)}
            </div>
            <div className="flex-1">
                <div className="font-medium">{connector.name}</div>
                <div className="text-xs text-muted-foreground">
                    {!ready ? 'Not available' : 'Connect using your wallet'}
                </div>
            </div>
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        </Button>
    )
}