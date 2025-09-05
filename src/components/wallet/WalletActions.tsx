
// Authentication actions component
import {AlertCircle, CheckCircle, Loader2, LogOut} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import type {User} from "@/store/authStore.ts";


export function WalletActions({
                                  user,
                                  loading,
                                  onLogin,
                                  onDisconnect
                              }: {
    user: User|null;
    loading: boolean;
    onLogin: () => void;
    onDisconnect: () => void;
}) {
    if (!user) {
        return (
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <AlertCircle className="h-4 w-4" />
                    Please authenticate to continue
                </div>
                <Button
                    onClick={onLogin}
                    disabled={loading}
                    className="w-full gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Authenticating...
                        </>
                    ) : (
                        <>
                            <CheckCircle className="h-4 w-4" />
                            Login
                        </>
                    )}
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-700 dark:text-green-400">
                    Successfully authenticated
                </span>
            </div>
            <Button
                onClick={onDisconnect}
                variant="destructive"
                className="w-full gap-2"
            >
                <LogOut className="h-4 w-4" />
                Disconnect & Logout
            </Button>
        </div>
    );
}