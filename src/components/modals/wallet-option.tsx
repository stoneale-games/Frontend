'use client';
import { useConnect } from 'wagmi'
import {Button} from "@/components/ui/button.tsx";

export function WalletOption() {
    const { connectors, connect } = useConnect()

    return connectors.map((connector) => (
        <Button key={connector.uid} onClick={() => connect({ connector })}>
         {connector.name}
    </Button>
))
}