
import {WalletManager} from "@/components/wallet/WalletManager.tsx";
import {isAuthenticated} from "@/lib/cookieHelper.ts";
import {useEffect} from "react";
import {useAuthStore} from "@/store/authStore.ts";
import {useDisconnect} from "wagmi";

export function ConnectWallet() {
    const {logout} = useAuthStore();
    const { disconnect } = useDisconnect();

    useEffect(() => {
        if(!isAuthenticated()){
            logout();
            disconnect();
        }
    }, [disconnect, logout]);
    return (
       <div className={"flex-col space-y-5 p-5"}>
         <WalletManager/>
       </div>
    );
}