import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import { useAuthStore } from "@/store/authStore.ts";
import { useCallback,  useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Badge, CheckCircle, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { WalletActions } from "@/components/wallet/WalletActions.tsx";

export function WalletStatus() {
    const { isConnected, address } = useAccount();
    const { disconnect } = useDisconnect();
    const { signMessageAsync } = useSignMessage();
    const { user, loading, authenticate, logout } = useAuthStore();

    const [authMessage, setAuthMessage] = useState<string | null>(null);
    const [retry, setRetry] = useState(false);

    const handleAuthenticate = useCallback(async () => {
        if (address && !loading) {
            try {
                setAuthMessage("Trying to authenticate you...");
                setRetry(false);

                // Timeout after 10 seconds if still not resolved
                const timeout = setTimeout(() => {
                    setAuthMessage("This is taking longer than usual. Do you want to retry?");
                    setRetry(true);
                }, 10000);

                await authenticate(address, signMessageAsync);

                clearTimeout(timeout);
                setAuthMessage(null); // success
            } catch (error) {
                console.error("Authentication failed:", error);
                setAuthMessage("Authentication failed. Please try again.");
                setRetry(true);
            }
        }
    }, [address, authenticate, signMessageAsync, loading]);

    const handleDisconnect = useCallback(() => {
        disconnect();
        logout();
        setAuthMessage(null);
        setRetry(false);
    }, [disconnect, logout]);

    const copyAddress = useCallback(() => {
        if (address) {
            navigator.clipboard.writeText(address);
        }
    }, [address]);

    if (!isConnected) {
        return null;
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <CardTitle className="text-lg">Wallet Connected</CardTitle>
                    </div>
                    <Badge className="gap-1">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        Connected
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <span className="text-sm font-mono">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyAddress}
                        className="h-8 w-8 p-0"
                    >
                        <Copy className="h-3 w-3" />
                    </Button>
                </div>

                <Separator />

                {authMessage && (
                    <div className="p-3 text-sm text-center bg-muted rounded-lg">
                        {authMessage}
                        {retry && (
                            <div className="mt-2 flex justify-center">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleDisconnect}
                                    className="gap-2"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    Retry
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                <WalletActions
                    user={user}
                    loading={loading}
                    onLogin={handleAuthenticate}
                    onDisconnect={handleDisconnect}
                />
            </CardContent>
        </Card>
    );
}
