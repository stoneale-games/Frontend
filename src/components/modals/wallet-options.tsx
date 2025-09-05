import * as React from 'react'
import {type Connector, useAccount, useConnect, useDisconnect, useSignMessage} from 'wagmi'
import {useCallback, useEffect} from "react";
import {useAuthStore} from "@/store/authStore.ts";
import {Button} from "@/components/ui/button.tsx";

export function WalletOptions() {
    const { connectors, connect } = useConnect()
    const { isConnected, address } = useAccount();
    const { disconnect } = useDisconnect();
    const { signMessageAsync } = useSignMessage();

    // Zustand store actions and state
    const { user,   loading, authenticate, logout } = useAuthStore();

    const handleAuthenticate = useCallback(async () => {
        if (address && !loading) {
            try {
                await authenticate(address, signMessageAsync);
            } catch (error) {
                console.error('Authentication failed:', error);
            }
        }
    }, [address, authenticate, signMessageAsync, loading]);

    const handleDisconnect = useCallback(() => {
        disconnect();
        logout(); // Also logout when disconnecting wallet
    }, [disconnect, logout]);

    return (
        <div className="wallet-container">
            {/* Wallet Connection Options */}
            <div className="wallet-connectors">
                {connectors.map((connector) => (
                    <WalletOption
                        key={connector.uid}
                        connector={connector}
                        onClick={() => connect({ connector })}
                    />
                ))}
            </div>

            {/* Connection Status and Actions */}
            {isConnected && (
                <div className="wallet-actions">
                    <p>Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</p>

                    {!user ? (
                        <button
                            onClick={handleAuthenticate}
                            disabled={loading}
                            className="login-btn"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    ) : (
                        <div>
                            <p>Welcome, {user.walletAddress || 'User'}!</p>
                            <button onClick={handleDisconnect} className="disconnect-btn">
                                Disconnect & Logout
                            </button>
                        </div>
                    )}
                </div>
            )}

            {!isConnected && (
                <p>Please connect your wallet first</p>
            )}
        </div>
    )
}

function WalletOption({connector, onClick,}: { connector: Connector, onClick: () => void }) {
    const [ready, setReady] = React.useState(false)

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
        <Button disabled={!ready} onClick={onClick} className="wallet-option-btn">
            {connector.name}
        </Button>
    )
}