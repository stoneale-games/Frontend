import { useCallback, useEffect } from "react";
import { Copy, LogOut, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { useStellarWallet } from "@/store/stellarWalletStore.ts";
import { shortAddress, stellarConfig } from "@/lib/stellar.ts";

// Connect / show the player's Stellar wallet via Freighter
export function FreighterConnect() {
    const { address, walletNetwork, connecting, error, connect, restore, disconnect } = useStellarWallet();

    useEffect(() => {
        restore();
    }, [restore]);

    const copyAddress = useCallback(() => {
        if (address) {
            navigator.clipboard.writeText(address);
            toast.success("Stellar address copied");
        }
    }, [address]);

    if (!address) {
        return (
            <div className="flex flex-col gap-2">
                <Button onClick={connect} disabled={connecting} className="gap-2">
                    <Wallet className="h-4 w-4" />
                    {connecting ? "Connecting..." : "Connect Freighter (Stellar)"}
                </Button>
                {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
        );
    }

    const wrongNetwork = walletNetwork && walletNetwork !== stellarConfig.network;

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-lg">Stellar Wallet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm font-mono">{shortAddress(address)}</span>
                    <Button variant="ghost" size="sm" onClick={copyAddress} className="h-8 w-8 p-0">
                        <Copy className="h-3 w-3" />
                    </Button>
                </div>
                {wrongNetwork && (
                    <p className="text-sm text-amber-600">
                        Freighter is on {walletNetwork}. Switch it to {stellarConfig.network} to play.
                    </p>
                )}
                <Button variant="outline" size="sm" onClick={disconnect} className="gap-2 w-full">
                    <LogOut className="h-4 w-4" />
                    Disconnect
                </Button>
            </CardContent>
        </Card>
    );
}
