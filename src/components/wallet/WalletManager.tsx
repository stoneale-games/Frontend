
import { useAccount} from 'wagmi'
import { useState} from "react";

// shadcn components
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

// Icons from lucide-react
import { Wallet} from "lucide-react"
import {WalletConnectors} from "@/components/wallet/WalletConnectors.tsx";
import {WalletStatus} from "@/components/wallet/WalletStatus.tsx";
import {logout} from "@/lib/cookieHelper.ts";


// Main component with modal trigger
export function WalletManager() {
    const { isConnected } = useAccount();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="wallet-manager">
            {!isConnected ? (
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="lg" className="gap-2">
                            <Wallet className="h-4 w-4" />
                            Connect Wallet
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Wallet className="h-5 w-5" />
                                Connect Your Wallet
                            </DialogTitle>
                        </DialogHeader>
                        <WalletConnectors onConnect={() => {
                            logout();
                            setIsModalOpen(false)
                        }} />
                    </DialogContent>
                </Dialog>
            ) : (
                <WalletStatus />
            )}
        </div>
    )
}



