
import {isAuthenticated} from "@/lib/cookieHelper.ts";
import {useCallback, useEffect, useState} from "react";
import {useAuthStore} from "@/store/authStore.ts";
import {useStellarWallet} from "@/store/stellarWalletStore.ts";
import {FreighterConnect} from "@/components/wallet/FreighterConnect.tsx";
import {WalletActions} from "@/components/wallet/WalletActions.tsx";

// Connect Freighter, then sign the backend nonce (SEP-53) to log in
export function ConnectWallet() {
    const {user, loading, authenticate, logout} = useAuthStore();
    const {address, signMsg, disconnect} = useStellarWallet();
    const [authMessage, setAuthMessage] = useState<string | null>(null);

    useEffect(() => {
        if(!isAuthenticated()){
            logout();
        }
    }, [logout]);

    const handleLogin = useCallback(async () => {
        if (!address || loading) return;
        setAuthMessage("Approve the sign-in request in Freighter...");
        await authenticate(address, ({message}) => signMsg(message));
        setAuthMessage(useAuthStore.getState().user ? null : "Authentication failed. Please try again.");
    }, [address, loading, authenticate, signMsg]);

    const handleDisconnect = useCallback(() => {
        disconnect();
        logout();
        setAuthMessage(null);
    }, [disconnect, logout]);

    return (
       <div className={"flex-col space-y-5 p-5"}>
         <FreighterConnect/>
         {address && (
             <div className="w-full max-w-md space-y-3">
                 {authMessage && (
                     <div className="p-3 text-sm text-center bg-muted rounded-lg">{authMessage}</div>
                 )}
                 <WalletActions
                     user={user}
                     loading={loading}
                     onLogin={handleLogin}
                     onDisconnect={handleDisconnect}
                 />
             </div>
         )}
       </div>
    );
}
