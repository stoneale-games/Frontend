'use client';
import {type Connector, useConnect } from 'wagmi'
import React from "react";
import {Button} from "@/components/ui/button.tsx";

export function WalletOptions() {
    const { connectors, connect } = useConnect()

    return connectors.map((connector) => (
        <WalletOption
            key={connector.uid}
    connector={connector}
    onClick={() => connect({ connector })}
    />
))
}

function WalletOption({
                          connector,
                          onClick,
                      }: {
    connector: Connector
    onClick: () => void
}) {
    const [ready, setReady] = React.useState(false)

    React.useEffect(() => {
        ;(async () => {
            const provider = await connector.getProvider()
            setReady(!!provider)
        })()
    }, [connector])

    return (
        <Button disabled={!ready} onClick={onClick}>
        {connector.name}
        </Button>
)
}